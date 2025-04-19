import localForage from 'localforage';
import { LlmKey } from './llmKey.nodel.ts';
import { LlmKeyRepository } from './llmKey.repository.ts';

class LlmKeyRepositoryLocal implements LlmKeyRepository {
  private readonly storageKey: string;

  constructor() {
    this.storageKey = 'llmKey';
  }

  async createLlmKey(key: LlmKey): Promise<LlmKey> {
    await localForage.setItem(this.storageKey, key);
    return key;
  }

  async getLlmKey(): Promise<LlmKey> {
    const llmKey = await localForage.getItem<LlmKey>(this.storageKey);
    if (!llmKey) {
      throw new Error('LlmKey not found');
    }
    return llmKey;
  }

  async updateLlmKey(key: LlmKey): Promise<LlmKey> {
    await localForage.setItem(this.storageKey, key);
    return key;
  }

  async deleteLlmKey(): Promise<void> {
    await localForage.removeItem(this.storageKey);
  }
}

export default LlmKeyRepositoryLocal;
