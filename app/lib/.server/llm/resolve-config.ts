import { detectOllama } from './ollama-detect';
import type { LLMConfig } from './config';
import { buildLLMConfig, readEnv, readExplicitProvider } from './config';

let cachedAutoConfig: { config: LLMConfig; expiresAt: number } | undefined;

const AUTO_CACHE_MS = 30_000;

export async function resolveLLMConfig(cloudflareEnv: Env): Promise<LLMConfig> {
  const explicit = readExplicitProvider(cloudflareEnv);

  if (explicit) {
    return buildLLMConfig(explicit, cloudflareEnv);
  }

  if (cachedAutoConfig && cachedAutoConfig.expiresAt > Date.now()) {
    return cachedAutoConfig.config;
  }

  const fromEnvKey = resolveFromEnvKeys(cloudflareEnv);

  if (fromEnvKey) {
    cacheAuto(fromEnvKey);

    return fromEnvKey;
  }

  // Ollama only exists on the developer machine — skip on Vercel/serverless.
  if (!process.env.VERCEL) {
    const ollamaBase = readEnv('OLLAMA_BASE_URL', cloudflareEnv) ?? 'http://127.0.0.1:11434/v1';
    const ollama = await detectOllama(ollamaBase);

    if (ollama) {
      const model = readEnv('LLM_MODEL', cloudflareEnv) ?? ollama.model;
      const config: LLMConfig = {
        provider: 'ollama',
        apiKey: readEnv('OPENAI_API_KEY', cloudflareEnv) ?? 'ollama',
        model,
        baseURL: ollama.baseURL,
      };

      cacheAuto(config);

      return config;
    }
  }

  throw new Error(
    [
      'No AI provider configured.',
      'Easiest fix: install Ollama (https://ollama.com), run `ollama signin`, then `ollama run nemotron-3-ultra:cloud` (or any model).',
      'Everix will auto-detect Ollama on localhost — no API key needed.',
      'On Vercel: set LLM_PROVIDER=google and GOOGLE_GENERATIVE_AI_API_KEY in Project → Environment Variables, then redeploy.',
      'Locally: add keys to .env.local — see .env.example.',
    ].join(' '),
  );
}

function cacheAuto(config: LLMConfig) {
  cachedAutoConfig = { config, expiresAt: Date.now() + AUTO_CACHE_MS };
}

function resolveFromEnvKeys(cloudflareEnv: Env): LLMConfig | null {
  if (readEnv('ANTHROPIC_API_KEY', cloudflareEnv)) {
    return buildLLMConfig('anthropic', cloudflareEnv);
  }

  if (readEnv('GOOGLE_GENERATIVE_AI_API_KEY', cloudflareEnv) || readEnv('GEMINI_API_KEY', cloudflareEnv)) {
    return buildLLMConfig('google', cloudflareEnv);
  }

  if (readEnv('GROQ_API_KEY', cloudflareEnv)) {
    return buildLLMConfig('groq', cloudflareEnv);
  }

  if (readEnv('OPENROUTER_API_KEY', cloudflareEnv)) {
    return buildLLMConfig('openrouter', cloudflareEnv);
  }

  if (readEnv('OPENAI_API_KEY', cloudflareEnv) && readEnv('LLM_PROVIDER', cloudflareEnv) === 'openai') {
    return buildLLMConfig('openai', cloudflareEnv);
  }

  return null;
}

export function formatLLMStatus(config: LLMConfig, auto: boolean) {
  return {
    ok: true as const,
    auto,
    provider: config.provider,
    model: config.model,
    label: auto ? `Auto: ${config.provider} (${config.model})` : `${config.provider} (${config.model})`,
  };
}

export async function getLLMStatus(cloudflareEnv: Env) {
  const auto = !readExplicitProvider(cloudflareEnv);

  try {
    const config = await resolveLLMConfig(cloudflareEnv);

    return formatLLMStatus(config, auto);
  } catch (error) {
    return {
      ok: false as const,
      auto,
      message: error instanceof Error ? error.message : 'Unknown LLM configuration error',
    };
  }
}
