import { buildLLMConfig, readExplicitProvider } from './config';

/** @deprecated Use resolveLLMConfig instead */
export function getAPIKey(cloudflareEnv: Env) {
  const provider = readExplicitProvider(cloudflareEnv) ?? 'anthropic';

  return buildLLMConfig(provider, cloudflareEnv).apiKey;
}
