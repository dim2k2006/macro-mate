import { FoodItemService, FoodItemServiceImpl, FoodItemRepositoryLocal } from '../domain/foodItem';
import { LlmKeyService, LlmKeyServiceImpl, LlmKeyRepositoryLocal } from '../domain/llmKey';
import { LlmProvider } from '../shared/llm.types';
import { LlmProviderOpenai } from '../providers/llm';

export function buildConfig(): Config {
  return {
    test: 'test',
  };
}

export type Config = {
  test: string;
};

export function buildContainer(config: Config): Container {
  const llmProvider = new LlmProviderOpenai({
    apiKey: '',
  });

  const foodItemRepository = new FoodItemRepositoryLocal();
  const foodItemService = new FoodItemServiceImpl({ foodItemRepository, llmProvider });

  const llmKeyRepository = new LlmKeyRepositoryLocal();
  const llmKeyService = new LlmKeyServiceImpl({ llmKeyRepository });

  return {
    config,
    foodItemService,
    llmKeyService,
    llmProvider,
  };
}

export type Container = {
  config: Config;
  foodItemService: FoodItemService;
  llmKeyService: LlmKeyService;
  llmProvider: LlmProvider;
};
