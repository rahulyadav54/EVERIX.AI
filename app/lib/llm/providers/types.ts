/**
 * Client-safe provider contract. Server implementations live under `app/lib/.server/llm/`.
 */
export interface LLMProviderContract {
  id: string;
  label: string;
  generate(input: unknown): Promise<unknown>;
  stream(input: unknown): AsyncIterable<unknown>;
  generateStructured<T>(input: unknown, schema: unknown): Promise<T>;
  countTokens(text: string): Promise<number>;
  validateConnection(): Promise<{ ok: boolean; message?: string }>;
}
