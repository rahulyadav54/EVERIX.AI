import { useStore } from '@nanostores/react';
import { useEffect, useState } from 'react';
import { buildLlmRequestHeaders } from '~/lib/llm/user-settings';
import { llmSettingsStore } from '~/lib/stores/llm-settings';

type Status =
  | { ok: true; label: string; provider: string; model: string; source?: string }
  | { ok: false; message: string };

/** Minimal status on landing — API keys are configured only via Settings (gear). */
export function LlmStatusBanner({ hidden }: { hidden?: boolean }) {
  const settings = useStore(llmSettingsStore);
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    if (hidden) {
      return;
    }

    const headers = buildLlmRequestHeaders(settings);

    fetch('/api/llm-status', { headers })
      .then((res) => res.json())
      .then((data) => setStatus(data as Status))
      .catch(() => setStatus(null));
  }, [hidden, settings]);

  if (hidden || !status) {
    return null;
  }

  if (status.ok) {
    const byok = settings.credentialMode === 'byok';

    return (
      <div className="mb-3 flex justify-center">
        <span className="inline-flex items-center gap-2 text-[11px] text-zinc-500 select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.65)]" />
          {byok ? 'Using your API key' : 'Everix AI ready'}
        </span>
      </div>
    );
  }

  return (
    <div className="mb-4 rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-3 text-sm text-bolt-elements-textPrimary max-w-md mx-auto">
      <p className="font-medium mb-1 text-xs">AI unavailable</p>
      <p className="text-bolt-elements-textSecondary text-xs leading-relaxed">{status.message}</p>
      <p className="mt-2 text-[10px] text-bolt-elements-textTertiary">
        Use the gear icon → <strong className="text-bolt-elements-textSecondary">API keys</strong> to connect your
        provider.
      </p>
    </div>
  );
}
