import { streamText as _streamText, convertToCoreMessages } from 'ai';
import { resolveLLMConfig } from '~/lib/.server/llm/resolve-config';
import { getModel } from '~/lib/.server/llm/model';
import { MAX_TOKENS } from './constants';
import { getSystemPrompt } from './prompts';

interface ToolResult<Name extends string, Args, Result> {
  toolCallId: string;
  toolName: Name;
  args: Args;
  result: Result;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  toolInvocations?: ToolResult<string, unknown, unknown>[];
}

export type Messages = Message[];

export type StreamingOptions = Omit<Parameters<typeof _streamText>[0], 'model'>;

export async function streamText(messages: Messages, env: Env, options?: StreamingOptions, request?: Request) {
  const { resolveLLMConfigFromRequest } = await import('./request-overrides');
  const llm = request ? await resolveLLMConfigFromRequest(request, env) : await resolveLLMConfig(env);

  return _streamText({
    model: getModel(llm),
    system: getSystemPrompt(),
    maxTokens: MAX_TOKENS,
    ...(llm.provider === 'anthropic'
      ? {
          headers: {
            'anthropic-beta': 'max-tokens-3-5-sonnet-2024-07-15',
          },
        }
      : {}),
    messages: convertToCoreMessages(messages),
    ...options,
  });
}
