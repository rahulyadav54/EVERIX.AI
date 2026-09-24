import type { LLMConfig, LLMProvider } from './config';
import { buildLLMConfig, OLLAMA_DEFAULT_BASE_URL, OPENROUTER_BASE_URL, readEnv } from './config';

export function getOverridesFromRequest(request: Request): LLMConfig | null {
  const provider = request.headers.get('X-Everix-LLM-Provider') as LLMProvider | null;
  const model = request.headers.get('X-Everix-LLM-Model');
  const apiKey = request.headers.get('X-Everix-LLM-Api-Key');
  const baseURLHeader = request.headers.get('X-Everix-LLM-Base-URL');
  const useServerKey = request.headers.get('X-Everix-Use-Server-Key') !== '0';

  if (!provider || !model) {
    return null;
  }

  if (!apiKey && useServerKey) {
    return null;
  }

  if (!apiKey && provider !== 'ollama') {
    return null;
  }

  const key = apiKey ?? 'ollama';

  switch (provider) {
    case 'openrouter':
      return { provider, apiKey: key, model, baseURL: OPENROUTER_BASE_URL };
    case 'ollama':
      return {
        provider,
        apiKey: key,
        model,
        baseURL: baseURLHeader ?? OLLAMA_DEFAULT_BASE_URL,
      };
    case 'openai':
      return { provider, apiKey: key, model, baseURL: baseURLHeader || undefined };
    default:
      return { provider, apiKey: key, model };
  }
}

export function resolveWithRequest(request: Request, cloudflareEnv: Env, fallback: () => Promise<LLMConfig>) {
  const overrides = getOverridesFromRequest(request);

  if (overrides) {
    return Promise.resolve(overrides);
  }

  return fallback();
}

/** Validates client override by building env-backed config when allowed */
export async function resolveLLMConfigFromRequest(request: Request, cloudflareEnv: Env) {
  const overrides = getOverridesFromRequest(request);

  if (overrides) {
    return overrides;
  }

  const credentialMode = request.headers.get('X-Everix-Credential-Mode');

  if (credentialMode === 'byok') {
    throw new Error(
      'Your API key was not applied. Open Settings → API keys, paste your key, click Test connection, then Save.',
    );
  }

  const provider = request.headers.get('X-Everix-LLM-Provider') as LLMProvider | null;
  const model = request.headers.get('X-Everix-LLM-Model');
  const useServerKey = request.headers.get('X-Everix-Use-Server-Key') !== '0';

  if (provider && model && useServerKey) {
    const patchedEnv: Env = {
      ...cloudflareEnv,
      LLM_PROVIDER: provider,
      LLM_MODEL: model,
    };

    if (provider === 'google' && !readEnv('GOOGLE_GENERATIVE_AI_API_KEY', patchedEnv)) {
      throw new Error('No Gemini key on server. Add your key in AI settings (gear icon) or .env.local');
    }

    return buildLLMConfig(provider, patchedEnv);
  }

  const { resolveLLMConfig } = await import('./resolve-config');

  return resolveLLMConfig(cloudflareEnv);
}
