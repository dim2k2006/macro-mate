import { v4 as uuidV4 } from 'uuid';
import { LlmKey } from './llmKey.model.ts';
import { LlmKeyRepository } from './llmKey.repository.ts';
import { LlmKeyService } from './llmKey.service.ts';

type ConstructorInput = {
  llmKeyRepository: LlmKeyRepository;
};

class LlmKeyServiceImpl implements LlmKeyService {
  private llmKeyRepository: LlmKeyRepository;

  constructor({ llmKeyRepository }: ConstructorInput) {
    this.llmKeyRepository = llmKeyRepository;
  }

  async createLlmKey(key: string): Promise<LlmKey> {
    const llmKey = { id: uuidV4(), key, createdAt: new Date(), updatedAt: new Date() };

    return this.llmKeyRepository.createLlmKey(llmKey);
  }

  async getLlmKey(): Promise<LlmKey> {
    return this.llmKeyRepository.getLlmKey();
  }

  async updateLlmKey(key: LlmKey): Promise<LlmKey> {
    return this.llmKeyRepository.updateLlmKey(key);
  }

  async deleteLlmKey(): Promise<void> {
    return this.llmKeyRepository.deleteLlmKey();
  }
}

export default LlmKeyServiceImpl;
