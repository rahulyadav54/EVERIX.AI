import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createGroq } from '@ai-sdk/groq';
import { createOpenAI } from '@ai-sdk/openai';
import type { LLMConfig } from './config';

export function getModel(config: LLMConfig) {
  switch (config.provider) {
    case 'google': {
      const google = createGoogleGenerativeAI({ apiKey: config.apiKey });

      return google(config.model);
    }

    case 'groq': {
      const groq = createGroq({ apiKey: config.apiKey });

      return groq(config.model);
    }

    case 'openrouter':
    case 'ollama':
    case 'openai': {
      const openai = createOpenAI({
        apiKey: config.apiKey,
        baseURL: config.baseURL,
      });

      return openai(config.model);
    }

    default: {
      const anthropic = createAnthropic({ apiKey: config.apiKey });

      return anthropic(config.model);
    }
  }
}
