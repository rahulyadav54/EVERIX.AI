import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { getServerEnv } from '~/lib/.server/get-server-env';
import { resolveLLMConfigFromRequest } from '~/lib/.server/llm/request-overrides';
import { formatLLMStatus } from '~/lib/.server/llm/resolve-config';

export async function loader({ context, request }: LoaderFunctionArgs) {
  try {
    const config = await resolveLLMConfigFromRequest(request, getServerEnv(context));
    const clientKey = request.headers.get('X-Everix-LLM-Api-Key');
    const useServer = request.headers.get('X-Everix-Use-Server-Key') !== '0';

    return json({
      ...formatLLMStatus(config, false),
      source: clientKey ? 'browser' : useServer ? 'server' : 'browser',
    });
  } catch (error) {
    return json({
      ok: false,
      message: error instanceof Error ? error.message : 'Unknown LLM configuration error',
    });
  }
}
