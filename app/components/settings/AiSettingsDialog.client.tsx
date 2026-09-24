import { useStore } from '@nanostores/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dialog, DialogButton, DialogDescription, DialogRoot, DialogTitle } from '~/components/ui/Dialog';
import { maskApiKey } from '~/lib/llm/provider-registry';
import {
  buildLlmRequestHeaders,
  LLM_PROVIDER_OPTIONS,
  type LlmUserProvider,
  type LlmUserSettings,
} from '~/lib/llm/user-settings';
import { llmSettingsStore, saveLlmSettings } from '~/lib/stores/llm-settings';
import { classNames } from '~/utils/classNames';
import { toast } from 'react-toastify';

interface AiSettingsDialogProps {
  open: boolean;
  onClose: () => void;
  initialTab?: 'everix' | 'apikeys';
}

type SettingsTab = 'everix' | 'apikeys';

export function AiSettingsDialog({ open, onClose, initialTab }: AiSettingsDialogProps) {
  const stored = useStore(llmSettingsStore);
  const [draft, setDraft] = useState<LlmUserSettings>(stored);
  const [tab, setTab] = useState<SettingsTab>(stored.credentialMode === 'byok' ? 'apikeys' : 'everix');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const apiKeyRef = useRef<HTMLInputElement>(null);

  const providerMeta = useMemo(
    () => LLM_PROVIDER_OPTIONS.find((p) => p.id === draft.provider) ?? LLM_PROVIDER_OPTIONS[0],
    [draft.provider],
  );

  useEffect(() => {
    if (open) {
      setDraft(stored);
      const tabFromOpen = initialTab ?? (stored.credentialMode === 'byok' ? 'apikeys' : 'everix');
      setTab(tabFromOpen);

      if (tabFromOpen === 'apikeys') {
        setDraft((c) => ({ ...c, credentialMode: 'byok', useServerKey: false }));
      }

      setTestResult(null);
    }
  }, [open, stored, initialTab]);

  useEffect(() => {
    if (open && tab === 'apikeys') {
      apiKeyRef.current?.focus();
    }
  }, [open, tab, draft.provider]);

  const selectProvider = (provider: LlmUserProvider) => {
    const meta = LLM_PROVIDER_OPTIONS.find((p) => p.id === provider)!;

    setDraft((current) => ({
      ...current,
      credentialMode: 'byok',
      provider,
      model: meta.defaultModel,
      baseURL:
        provider === 'ollama'
          ? 'http://127.0.0.1:11434/v1'
          : provider === 'custom'
            ? current.baseURL || ''
            : provider === 'openai'
              ? current.baseURL
              : '',
      useServerKey: false,
    }));
    setTab('apikeys');
  };

  const onSave = () => {
    const resolvedKey = draft.apiKey.trim() || stored.apiKey.trim();

    const next: LlmUserSettings = {
      ...draft,
      credentialMode: tab === 'everix' ? 'everix' : 'byok',
      useServerKey: tab === 'everix',
      apiKey: tab === 'everix' ? '' : resolvedKey,
    };

    if (tab === 'everix') {
      next.apiKey = '';
    } else if (next.provider !== 'ollama' && !resolvedKey) {
      setTestResult('Add an API key before saving, or switch to Everix AI.');
      return;
    }

    if (next.provider === 'custom' && !next.baseURL.trim()) {
      setTestResult('Custom providers need an API base URL (OpenAI-compatible).');
      return;
    }

    saveLlmSettings(next);
    toast.success(
      tab === 'apikeys' ? 'API key saved — Everix will use your provider for chat.' : 'Everix AI selected.',
    );
    onClose();
  };

  const onTest = useCallback(async () => {
    setTesting(true);
    setTestResult(null);

    const testDraft: LlmUserSettings = {
      ...draft,
      apiKey: draft.apiKey.trim() || stored.apiKey,
      credentialMode: tab === 'everix' ? 'everix' : 'byok',
      useServerKey: tab === 'everix',
    };

    const headers = buildLlmRequestHeaders(testDraft);

    try {
      const res = await fetch('/api/llm-status', { headers });
      const data = await res.json();

      if (data.ok) {
        setTestResult(
          tab === 'everix'
            ? 'Everix AI is connected.'
            : `Connected — your ${providerMeta.label} key will be used for chat.`,
        );
      } else {
        setTestResult(data.message ?? 'Connection failed');
      }
    } catch {
      setTestResult('Could not reach the server. Is `npm run dev` running?');
    } finally {
      setTesting(false);
    }
  }, [draft, tab]);

  const showApiKey = draft.provider !== 'ollama';
  const showBaseUrl =
    draft.provider === 'custom' ||
    draft.provider === 'ollama' ||
    draft.provider === 'openai' ||
    providerMeta.showBaseUrl;

  return (
    <DialogRoot open={open}>
      <Dialog onClose={onClose} className="max-w-2xl max-h-[min(90vh,720px)] flex flex-col">
        <DialogTitle>AI settings</DialogTitle>

        <div className="flex gap-1 p-1 rounded-xl bg-bolt-elements-bg-depth-2 border border-bolt-elements-borderColor/60 mb-4">
          <button
            type="button"
            className={classNames(
              'flex-1 text-sm font-medium py-2 rounded-lg transition-theme',
              tab === 'everix'
                ? 'bg-accent-500/15 text-accent-500 shadow-sm'
                : 'text-bolt-elements-textTertiary hover:text-bolt-elements-textSecondary',
            )}
            onClick={() => {
              setTab('everix');
              setDraft((c) => ({ ...c, credentialMode: 'everix' }));
            }}
          >
            Everix AI
          </button>
          <button
            type="button"
            className={classNames(
              'flex-1 text-sm font-medium py-2 rounded-lg transition-theme',
              tab === 'apikeys'
                ? 'bg-accent-500/15 text-accent-500 shadow-sm'
                : 'text-bolt-elements-textTertiary hover:text-bolt-elements-textSecondary',
            )}
            onClick={() => {
              setTab('apikeys');
              setDraft((c) => ({ ...c, credentialMode: 'byok', useServerKey: false }));
            }}
          >
            API keys
          </button>
        </div>

        <DialogDescription asChild>
          <div className="space-y-4 text-sm text-bolt-elements-textSecondary overflow-y-auto flex-1 min-h-0 pr-1">
            {tab === 'everix' ? (
              <section className="everix-glass-panel rounded-xl p-4">
                <p className="font-medium text-bolt-elements-textPrimary">Managed by Everix</p>
                <p className="text-xs mt-2 leading-relaxed">
                  No API key on your device. When quota is reached, switch to <strong>API keys</strong> and paste your
                  own provider key (like Cline / VS Code agents).
                </p>
                <p className="text-xs mt-3 text-bolt-elements-textTertiary">
                  Keys are never written into generated projects or shown in the preview.
                </p>
              </section>
            ) : (
              <>
                <p className="text-xs text-bolt-elements-textTertiary">
                  Choose a provider, paste your API key, set the model ID, then Test → Save. Stored only in this browser.
                </p>

                <label className="block space-y-1.5">
                  <span className="text-bolt-elements-textPrimary font-medium text-xs uppercase tracking-wide">
                    Provider
                  </span>
                  <select
                    className="w-full rounded-lg border border-bolt-elements-borderColor bg-bolt-elements-bg-depth-1 px-3 py-2.5 text-bolt-elements-textPrimary"
                    value={draft.provider}
                    onChange={(e) => selectProvider(e.target.value as LlmUserProvider)}
                  >
                    {LLM_PROVIDER_OPTIONS.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <span className="text-xs">{providerMeta.hint}</span>
                </label>

                {showApiKey && (
                  <label className="block space-y-1.5">
                    <span className="text-bolt-elements-textPrimary font-medium text-xs uppercase tracking-wide">
                      {providerMeta.keyLabel}
                    </span>
                    <input
                      ref={apiKeyRef}
                      type="password"
                      autoComplete="off"
                      className="w-full rounded-lg border border-accent-500/30 bg-bolt-elements-bg-depth-1 px-3 py-3 text-bolt-elements-textPrimary font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/40"
                      value={draft.apiKey}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          apiKey: e.target.value,
                          credentialMode: 'byok',
                          useServerKey: false,
                        })
                      }
                      placeholder="sk-… or paste your provider API key"
                    />
                    {stored.apiKey && draft.credentialMode === 'byok' && !draft.apiKey && (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
                        Key on file: {maskApiKey(stored.apiKey)} — enter again to replace
                      </span>
                    )}
                  </label>
                )}

                <label className="block space-y-1.5">
                  <span className="text-bolt-elements-textPrimary font-medium text-xs uppercase tracking-wide">
                    Model ID
                  </span>
                  <input
                    className="w-full rounded-lg border border-bolt-elements-borderColor bg-bolt-elements-bg-depth-1 px-3 py-2.5 text-bolt-elements-textPrimary font-mono text-sm"
                    value={draft.model}
                    onChange={(e) => setDraft({ ...draft, model: e.target.value })}
                    placeholder={providerMeta.defaultModel}
                  />
                  <span className="text-[10px] text-bolt-elements-textTertiary">
                    Any model string your provider accepts (e.g. gpt-4o, claude-3-5-sonnet, gemini-3.5-flash-lite)
                  </span>
                </label>

                {showBaseUrl && (
                  <label className="block space-y-1.5">
                    <span className="text-bolt-elements-textPrimary font-medium text-xs uppercase tracking-wide">
                      API base URL {draft.provider === 'custom' ? '(required)' : '(optional)'}
                    </span>
                    <input
                      className="w-full rounded-lg border border-bolt-elements-borderColor bg-bolt-elements-bg-depth-1 px-3 py-2.5 text-bolt-elements-textPrimary font-mono text-xs"
                      value={draft.baseURL}
                      onChange={(e) => setDraft({ ...draft, baseURL: e.target.value })}
                      placeholder={providerMeta.baseUrlPlaceholder ?? 'https://api.openai.com/v1'}
                    />
                  </label>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
                  {LLM_PROVIDER_OPTIONS.filter((p) => p.id !== 'custom').map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className={classNames(
                        'text-[10px] rounded-md border px-2 py-1.5 truncate',
                        draft.provider === p.id
                          ? 'border-accent-500/50 text-accent-500 bg-accent-500/10'
                          : 'border-bolt-elements-borderColor text-bolt-elements-textTertiary hover:border-accent-500/30',
                      )}
                      onClick={() => selectProvider(p.id)}
                    >
                      {p.label.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </>
            )}

            {testResult && (
              <p
                className={classNames('text-xs rounded-lg px-3 py-2.5', {
                  'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400':
                    testResult.includes('success') || testResult.includes('connected') || testResult.includes('Connected'),
                  'bg-orange-500/10 text-orange-800 dark:text-orange-300': !(
                    testResult.includes('success') ||
                    testResult.includes('connected') ||
                    testResult.includes('Connected')
                  ),
                })}
              >
                {testResult}
              </p>
            )}
          </div>
        </DialogDescription>

        <div className="flex flex-wrap gap-2 justify-end mt-4 pt-4 border-t border-bolt-elements-borderColor/50 shrink-0">
          <DialogButton type="secondary" onClick={onTest} disabled={testing}>
            {testing ? 'Testing…' : 'Test connection'}
          </DialogButton>
          <DialogButton type="secondary" onClick={onClose}>
            Cancel
          </DialogButton>
          <DialogButton type="primary" onClick={onSave}>
            Save
          </DialogButton>
        </div>
      </Dialog>
    </DialogRoot>
  );
}
