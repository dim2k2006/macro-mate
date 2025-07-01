import { v4 as uuidV4 } from 'uuid';
import { CreateFoodItemInput, FoodItemService } from './foodItem.service';
import { FoodItemRepository } from './foodItem.repository';
import { FoodItem } from './foodItem.model';
import { LlmProvider } from '@/shared/llm.types.ts';

type ConstructorInput = {
  foodItemRepository: FoodItemRepository;
  llmProvider: LlmProvider;
};

class FoodItemServiceImpl implements FoodItemService {
  private readonly foodItemRepository: FoodItemRepository;

  private readonly llmProvider: LlmProvider;

  constructor({ foodItemRepository, llmProvider }: ConstructorInput) {
    this.foodItemRepository = foodItemRepository;
    this.llmProvider = llmProvider;
  }

  async createFoodItem(input: CreateFoodItemInput): Promise<FoodItem> {
    const foodItem: FoodItem = {
      id: uuidV4(),
      state: 'cooking',
      unit: input.unit,
      description: input.description,
      name: input.name,
      calories: input.calories,
      proteins: input.proteins,
      fats: input.fats,
      carbs: input.carbs,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return this.foodItemRepository.createFoodItem(foodItem);
  }

  async getFoodItemById(id: string): Promise<FoodItem> {
    return this.foodItemRepository.getFoodItemById(id);
  }

  async listFoodItems(): Promise<FoodItem[]> {
    const foodItems = await this.foodItemRepository.listFoodItems();

    return foodItems.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });
  }

  async updateFoodItem(id: string, foodItem: FoodItem): Promise<FoodItem> {
    foodItem.updatedAt = new Date().toISOString();

    return this.foodItemRepository.updateFoodItem(id, foodItem);
  }

  async upsertFoodItem(id: string, foodItem: FoodItem): Promise<FoodItem> {
    foodItem.updatedAt = new Date().toISOString();

    return this.foodItemRepository.upsertFoodItem(id, foodItem);
  }

  async deleteFoodItem(id: string): Promise<void> {
    return this.foodItemRepository.deleteFoodItem(id);
  }

  async calculateMacros(id: string): Promise<FoodItem> {
    const foodItem = await this.foodItemRepository.getFoodItemById(id);

    if (!foodItem) {
      throw new Error('Food item not found');
    }

    const messages = [
      this.llmProvider.buildChatMessage({
        role: 'user',
        content: foodItem.description,
      }),
    ];

    const { calories, proteins, fats, carbs, dish } = await this.llmProvider.calculateMacros({
      messages,
    });

    foodItem.name = dish;
    foodItem.calories = calories;
    foodItem.proteins = proteins;
    foodItem.fats = fats;
    foodItem.carbs = carbs;
    foodItem.updatedAt = new Date().toISOString();

    return this.foodItemRepository.updateFoodItem(id, foodItem);
  }

  async parseMacros(id: string): Promise<FoodItem> {
    const foodItem = await this.foodItemRepository.getFoodItemById(id);

    if (!foodItem) {
      throw new Error('Food item not found');
    }

    const messages = [
      this.llmProvider.buildChatMessage({
        role: 'user',
        content: foodItem.description,
      }),
    ];

    const { calories, proteins, fats, carbs, dish } = await this.llmProvider.parseMacros({
      messages,
    });

    foodItem.name = dish;
    foodItem.calories = calories;
    foodItem.proteins = proteins;
    foodItem.fats = fats;
    foodItem.carbs = carbs;
    foodItem.updatedAt = new Date().toISOString();

    return this.foodItemRepository.updateFoodItem(id, foodItem);
  }

  async recognizeMacrosFromImage(input: File[]): Promise<FoodItem> {
    const { calories, proteins, fats, carbs, dish } = await this.llmProvider.recognizeMacrosFromImage(input);

    const foodItem: FoodItem = {
      id: uuidV4(),
      state: 'cooked',
      unit: 'g',
      description: dish,
      name: dish,
      calories,
      proteins,
      fats,
      carbs,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return foodItem;
  }
}

export default FoodItemServiceImpl;
