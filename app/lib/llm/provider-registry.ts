/**
 * EVERIX LLM provider registry — UI labels and model lists only.
 * Secrets and managed routing stay on the server.
 */

export type ProviderId = 'everix' | 'google' | 'openai' | 'anthropic' | 'openrouter' | 'groq' | 'ollama' | 'custom';

export interface ProviderDefinition {
  id: ProviderId;
  label: string;
  description: string;
  managed: boolean;
  models: string[];
  defaultModel: string;
}

export const EVERIX_MANAGED_PROVIDER: ProviderDefinition = {
  id: 'everix',
  label: 'Everix AI',
  description: 'Managed inference — no API key required on your device.',
  managed: true,
  models: ['Gemini Flash', 'Auto'],
  defaultModel: 'Auto',
};

export const BYOK_PROVIDERS: ProviderDefinition[] = [
  {
    id: 'google',
    label: 'Google Gemini',
    description: 'Bring your Gemini API key from AI Studio.',
    managed: false,
    models: ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-2.5-flash-preview-05-20'],
    defaultModel: 'gemini-2.0-flash',
  },
  {
    id: 'openai',
    label: 'OpenAI',
    description: 'GPT-4o family and compatible chat models.',
    managed: false,
    models: ['gpt-4o-mini', 'gpt-4o', 'gpt-4.1-mini'],
    defaultModel: 'gpt-4o-mini',
  },
  {
    id: 'anthropic',
    label: 'Anthropic',
    description: 'Claude models for coding agents.',
    managed: false,
    models: ['claude-3-5-sonnet-20240620', 'claude-3-5-haiku-20241022'],
    defaultModel: 'claude-3-5-sonnet-20240620',
  },
  {
    id: 'openrouter',
    label: 'OpenRouter',
    description: 'Route to many models with one key.',
    managed: false,
    models: ['google/gemini-2.0-flash-exp:free', 'anthropic/claude-3.5-sonnet'],
    defaultModel: 'google/gemini-2.0-flash-exp:free',
  },
  {
    id: 'groq',
    label: 'Groq',
    description: 'Fast inference for open models.',
    managed: false,
    models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'],
    defaultModel: 'llama-3.3-70b-versatile',
  },
  {
    id: 'ollama',
    label: 'Ollama',
    description: 'Local or cloud models via Ollama on your machine.',
    managed: false,
    models: ['nemotron-3-ultra:cloud', 'llama3.2'],
    defaultModel: 'nemotron-3-ultra:cloud',
  },
  {
    id: 'custom',
    label: 'Custom OpenAI-compatible',
    description: 'Any OpenAI-compatible API base URL.',
    managed: false,
    models: ['default'],
    defaultModel: 'default',
  },
];

export function maskApiKey(key: string) {
  if (!key || key.length < 8) {
    return '';
  }

  return `${key.slice(0, 4)}••••••••${key.slice(-4)}`;
}

export function displayProviderLabel(settings: {
  credentialMode: 'everix' | 'byok';
  provider: string;
}): string {
  if (settings.credentialMode === 'everix') {
    return 'Everix AI';
  }

  const found = BYOK_PROVIDERS.find((p) => p.id === settings.provider);

  return found?.label ?? 'Your provider';
}
