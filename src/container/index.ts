import { FoodItemService, FoodItemServiceImpl, FoodItemRepositoryLocal } from '../domain/foodItem';
import { LlmKeyService, LlmKeyServiceImpl, LlmKeyRepositoryLocal } from '../domain/llmKey';
import { LlmProvider } from '../shared/llm.types';
import { LlmProviderOpenai } from '../providers/llm';

export function buildConfig(llmKey: string): Config {
  return {
    llmKey,
  };
}

export type Config = {
  llmKey: string;
};

export function buildContainer(config: Config): Container {
  const llmProvider = new LlmProviderOpenai({
    apiKey: config.llmKey,
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
