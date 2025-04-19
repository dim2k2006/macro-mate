import { FoodItem } from './foodItem.model.ts';

export interface FoodItemRepository {
  createFoodItem: (foodItem: FoodItem) => Promise<FoodItem>;
  getFoodItemById: (id: string) => Promise<FoodItem>;
  listFoodItems: () => Promise<FoodItem[]>;
  updateFoodItem: (id: string, foodItem: FoodItem) => Promise<FoodItem>;
  deleteFoodItem: (id: string) => Promise<void>;
}
