import { v4 as uuidV4 } from 'uuid';
import { FoodItemService, CreateFoodItemInput } from './foodItem.service';
import { FoodItemRepository } from './foodItem.repository';
import { FoodItem } from './foodItem.model';

type ConstructorInput = {
  foodItemRepository: FoodItemRepository;
};

class FoodItemServiceImpl implements FoodItemService {
  private readonly foodItemRepository: FoodItemRepository;

  constructor({ foodItemRepository }: ConstructorInput) {
    this.foodItemRepository = foodItemRepository;
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
    return this.foodItemRepository.listFoodItems();
  }

  async updateFoodItem(id: string, foodItem: FoodItem): Promise<FoodItem> {
    return this.foodItemRepository.updateFoodItem(id, foodItem);
  }

  async deleteFoodItem(id: string): Promise<void> {
    return this.foodItemRepository.deleteFoodItem(id);
  }

  async calculateMacros(id: string): Promise<FoodItem> {}
}

export default FoodItemServiceImpl;
