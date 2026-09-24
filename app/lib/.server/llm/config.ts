import { env as nodeEnv } from 'node:process';

export type LLMProvider = 'anthropic' | 'google' | 'groq' | 'openrouter' | 'ollama' | 'openai';

const DEFAULT_MODELS: Record<LLMProvider, string> = {
  anthropic: 'claude-3-5-sonnet-20240620',
  google: 'gemini-3.5-flash-lite',
  groq: 'llama-3.3-70b-versatile',
  openrouter: 'google/gemini-2.0-flash-exp:free',
  ollama: 'llama3.2',
  openai: 'gpt-4o-mini',
};

export const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
export const OLLAMA_DEFAULT_BASE_URL = 'http://127.0.0.1:11434/v1';

export function readEnv(key: string, cloudflareEnv: Env): string | undefined {
  const fromNode = nodeEnv[key as keyof typeof nodeEnv];

  if (typeof fromNode === 'string' && fromNode.length > 0) {
    return fromNode;
  }

  const fromCf = cloudflareEnv[key as keyof Env];

  if (typeof fromCf === 'string' && fromCf.length > 0) {
    return fromCf;
  }

  return undefined;
}

export function readExplicitProvider(cloudflareEnv: Env): LLMProvider | undefined {
  const normalized = readEnv('LLM_PROVIDER', cloudflareEnv)?.toLowerCase().trim();

  if (
    normalized === 'google' ||
    normalized === 'groq' ||
    normalized === 'openrouter' ||
    normalized === 'ollama' ||
    normalized === 'openai' ||
    normalized === 'anthropic' ||
    normalized === 'auto'
  ) {
    return normalized === 'auto' ? undefined : normalized;
  }

  return undefined;
}

export interface LLMConfig {
  provider: LLMProvider;
  apiKey: string;
  model: string;
  baseURL?: string;
}

export function buildLLMConfig(provider: LLMProvider, cloudflareEnv: Env): LLMConfig {
  const model = readEnv('LLM_MODEL', cloudflareEnv) ?? DEFAULT_MODELS[provider];

  switch (provider) {
    case 'google': {
      const apiKey = readEnv('GOOGLE_GENERATIVE_AI_API_KEY', cloudflareEnv) ?? readEnv('GEMINI_API_KEY', cloudflareEnv);

      if (!apiKey) {
        throw new Error('Missing GOOGLE_GENERATIVE_AI_API_KEY (or GEMINI_API_KEY) for LLM_PROVIDER=google');
      }

      return { provider, apiKey, model };
    }

    case 'groq': {
      const apiKey = readEnv('GROQ_API_KEY', cloudflareEnv);

      if (!apiKey) {
        throw new Error('Missing GROQ_API_KEY for LLM_PROVIDER=groq');
      }

      return { provider, apiKey, model };
    }

    case 'openrouter': {
      const apiKey = readEnv('OPENROUTER_API_KEY', cloudflareEnv);

      if (!apiKey) {
        throw new Error('Missing OPENROUTER_API_KEY for LLM_PROVIDER=openrouter');
      }

      return { provider, apiKey, model, baseURL: OPENROUTER_BASE_URL };
    }

    case 'ollama': {
      const baseURL = readEnv('OLLAMA_BASE_URL', cloudflareEnv) ?? OLLAMA_DEFAULT_BASE_URL;

      return {
        provider,
        apiKey: readEnv('OPENAI_API_KEY', cloudflareEnv) ?? 'ollama',
        model,
        baseURL,
      };
    }

    case 'openai': {
      const apiKey = readEnv('OPENAI_API_KEY', cloudflareEnv);

      if (!apiKey) {
        throw new Error('Missing OPENAI_API_KEY for LLM_PROVIDER=openai');
      }

      const baseURL = readEnv('OPENAI_BASE_URL', cloudflareEnv);

      return { provider, apiKey, model, baseURL };
    }

    default: {
      const apiKey = readEnv('ANTHROPIC_API_KEY', cloudflareEnv);

      if (!apiKey) {
        throw new Error('Missing ANTHROPIC_API_KEY for LLM_PROVIDER=anthropic');
      }

      return { provider: 'anthropic', apiKey, model };
    }
  }
}

/** @deprecated Use resolveLLMConfig() for auto-detection */
export function getLLMConfig(cloudflareEnv: Env): LLMConfig {
  const explicit = readExplicitProvider(cloudflareEnv) ?? 'anthropic';

  return buildLLMConfig(explicit, cloudflareEnv);
}
