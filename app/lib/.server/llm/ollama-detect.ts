const OLLAMA_TAGS_PATH = '/api/tags';

/** Models we prefer for coding agents (first match wins). */
const PREFERRED_MODEL_IDS = [
  'nemotron-3-ultra:cloud',
  'nemotron-3-super',
  'nemotron-3-nano',
  'llama3.3',
  'llama3.2',
  'qwen2.5-coder',
  'deepseek-coder',
  'codellama',
  'mistral',
];

export interface OllamaDetection {
  baseURL: string;
  model: string;
  models: string[];
}

function normalizeBaseUrl(baseURL: string) {
  return baseURL.replace(/\/v1\/?$/, '');
}

function pickModel(available: string[]): string | undefined {
  for (const preferred of PREFERRED_MODEL_IDS) {
    const match = available.find((name) => name.toLowerCase() === preferred.toLowerCase());

    if (match) {
      return match;
    }

    const partial = available.find((name) => name.toLowerCase().includes(preferred.split(':')[0]!));

    if (partial) {
      return partial;
    }
  }

  return available[0];
}

export async function detectOllama(baseURL = 'http://127.0.0.1:11434/v1'): Promise<OllamaDetection | null> {
  const origin = normalizeBaseUrl(baseURL);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);

  try {
    const response = await fetch(`${origin}${OLLAMA_TAGS_PATH}`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as { models?: { name: string }[] };
    const models = (data.models ?? []).map((entry) => entry.name).filter(Boolean);

    if (models.length === 0) {
      return null;
    }

    const model = pickModel(models);

    if (!model) {
      return null;
    }

    return {
      baseURL: `${origin}/v1`,
      model,
      models,
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
