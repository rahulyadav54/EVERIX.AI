import { atom } from 'nanostores';
import {
  DEFAULT_LLM_USER_SETTINGS,
  LLM_SETTINGS_STORAGE_KEY,
  type LlmUserSettings,
} from '~/lib/llm/user-settings';

function loadSettings(): LlmUserSettings {
  if (import.meta.env.SSR) {
    return DEFAULT_LLM_USER_SETTINGS;
  }

  try {
    const raw = localStorage.getItem(LLM_SETTINGS_STORAGE_KEY);

    if (!raw) {
      return DEFAULT_LLM_USER_SETTINGS;
    }

    return { ...DEFAULT_LLM_USER_SETTINGS, ...JSON.parse(raw) } as LlmUserSettings;
  } catch {
    return DEFAULT_LLM_USER_SETTINGS;
  }
}

export const llmSettingsStore = atom<LlmUserSettings>(loadSettings());

export function saveLlmSettings(settings: LlmUserSettings) {
  const normalized: LlmUserSettings = {
    ...settings,
    useServerKey: settings.credentialMode === 'everix',
    model: settings.model.trim(),
    apiKey: settings.credentialMode === 'everix' ? '' : settings.apiKey.trim(),
  };

  llmSettingsStore.set(normalized);

  if (!import.meta.env.SSR) {
    localStorage.setItem(LLM_SETTINGS_STORAGE_KEY, JSON.stringify(normalized));
  }
}

export function resetLlmSettings() {
  saveLlmSettings(DEFAULT_LLM_USER_SETTINGS);
}
