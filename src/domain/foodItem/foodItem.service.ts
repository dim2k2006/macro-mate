import { FoodItem } from './foodItem.model.ts';

export interface FoodItemService {
  createFoodItem: (input: CreateFoodItemInput) => Promise<FoodItem>;
  getFoodItemById: (id: string) => Promise<FoodItem>;
  listFoodItems: () => Promise<FoodItem[]>;
  updateFoodItem: (id: string, foodItem: FoodItem) => Promise<FoodItem>;
  upsertFoodItem: (id: string, foodItem: FoodItem) => Promise<FoodItem>;
  deleteFoodItem: (id: string) => Promise<void>;
  calculateMacros: (id: string) => Promise<FoodItem>;
}

export type CreateFoodItemInput = {
  state: 'cooking' | 'cooked';
  unit: 'g' | 'ml';
  description: string;
  name: string;
  calories?: number;
  proteins?: number;
  fats?: number;
  carbs?: number;
};
