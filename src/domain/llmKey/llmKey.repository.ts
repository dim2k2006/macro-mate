import { LlmKey } from './llmKey.model.ts';

export interface LlmKeyRepository {
  createLlmKey(key: LlmKey): Promise<LlmKey>;
  getLlmKey(): Promise<LlmKey>;
  updateLlmKey(key: LlmKey): Promise<LlmKey>;
  deleteLlmKey(): Promise<void>;
}
