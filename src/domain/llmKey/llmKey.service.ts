import { LlmKey } from './llmKey.nodel.ts';

export interface LlmKeyService {
  createLlmKey(key: string): Promise<LlmKey>;
  getLlmKey(): Promise<LlmKey>;
  updateLlmKey(key: LlmKey): Promise<LlmKey>;
  deleteLlmKey(): Promise<void>;
  hasLlmKey(): Promise<boolean>;
}
