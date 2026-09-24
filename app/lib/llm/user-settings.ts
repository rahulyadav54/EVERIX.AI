export type LlmUserProvider = 'google' | 'groq' | 'openrouter' | 'anthropic' | 'openai' | 'ollama' | 'custom';

export interface LlmUserSettings {
  /** everix = managed backend; byok = user-supplied key */
  credentialMode: 'everix' | 'byok';
  provider: LlmUserProvider;
  model: string;
  apiKey: string;
  baseURL: string;
  /** When true, empty API key falls back to server `.env.local` (dev/deploy). */
  useServerKey: boolean;
}

export const LLM_SETTINGS_STORAGE_KEY = 'everix_llm_settings_v1';

export const DEFAULT_LLM_USER_SETTINGS: LlmUserSettings = {
  credentialMode: 'everix',
  provider: 'google',
  model: 'gemini-2.0-flash',
  apiKey: '',
  baseURL: '',
  useServerKey: true,
};

export const LLM_PROVIDER_OPTIONS: {
  id: LlmUserProvider;
  label: string;
  hint: string;
  defaultModel: string;
  keyLabel: string;
  showBaseUrl?: boolean;
  baseUrlPlaceholder?: string;
}[] = [
  {
    id: 'google',
    label: 'Google Gemini',
    hint: 'Free tier at aistudio.google.com/apikey',
    defaultModel: 'gemini-2.0-flash',
    keyLabel: 'Gemini API key',
  },
  {
    id: 'groq',
    label: 'Groq',
    hint: 'console.groq.com/keys',
    defaultModel: 'llama-3.3-70b-versatile',
    keyLabel: 'Groq API key',
  },
  {
    id: 'openrouter',
    label: 'OpenRouter',
    hint: 'openrouter.ai/keys — many free models',
    defaultModel: 'google/gemini-2.0-flash-exp:free',
    keyLabel: 'OpenRouter API key',
  },
  {
    id: 'anthropic',
    label: 'Anthropic Claude',
    hint: 'console.anthropic.com',
    defaultModel: 'claude-3-5-sonnet-20240620',
    keyLabel: 'Anthropic API key',
  },
  {
    id: 'openai',
    label: 'OpenAI',
    hint: 'platform.openai.com',
    defaultModel: 'gpt-4o-mini',
    keyLabel: 'OpenAI API key',
    showBaseUrl: true,
    baseUrlPlaceholder: 'Optional custom base URL',
  },
  {
    id: 'ollama',
    label: 'Ollama (local)',
    hint: 'No cloud key — run Ollama on your PC',
    defaultModel: 'nemotron-3-ultra:cloud',
    keyLabel: 'Not required',
    showBaseUrl: true,
    baseUrlPlaceholder: 'http://127.0.0.1:11434/v1',
  },
  {
    id: 'custom',
    label: 'Custom (OpenAI-compatible)',
    hint: 'Any OpenAI-compatible endpoint — DeepSeek, Mistral, xAI, Azure, etc.',
    defaultModel: 'gpt-4o-mini',
    keyLabel: 'API key',
    showBaseUrl: true,
    baseUrlPlaceholder: 'https://api.example.com/v1',
  },
];

export function buildLlmRequestHeaders(settings: LlmUserSettings): Record<string, string> {
  const useEverix = settings.credentialMode === 'everix';
  let provider = useEverix ? 'google' : settings.provider;

  if (provider === 'custom') {
    provider = 'openai';
  }

  const clientKey = settings.apiKey.trim();
  const useServerKey = useEverix || (settings.credentialMode === 'byok' ? false : settings.useServerKey && !clientKey);

  const headers: Record<string, string> = {
    'X-Everix-Credential-Mode': settings.credentialMode,
    'X-Everix-LLM-Provider': provider,
    'X-Everix-LLM-Model': useEverix ? 'auto' : settings.model.trim(),
    'X-Everix-Use-Server-Key': useServerKey ? '1' : '0',
  };

  if (!useEverix && clientKey) {
    headers['X-Everix-LLM-Api-Key'] = clientKey;
  }

  if (settings.baseURL.trim()) {
    headers['X-Everix-LLM-Base-URL'] = settings.baseURL.trim();
  }

  return headers;
}
