import { Meal, MealType } from './meal.model';

export interface MealService {
  createMeal(input: CreateMealInput): Promise<EnhancedMeal>;
  getMealsByDate(date: string): Promise<EnhancedMeal[]>;
  listMeals(): Promise<EnhancedMeal[]>;
  upsertMeal(mealId: string, meal: Meal): Promise<EnhancedMeal>;
  updateMeal(mealId: string, meal: Partial<Meal>): Promise<EnhancedMeal>;
  deleteMeal(mealId: string): Promise<void>;
  getMacrosByDate(date: string): Promise<{ calories: number; proteins: number; fats: number; carbs: number }>;
}

export type CreateMealInput = {
  foodItemId: string;
  amount: number;
  type: MealType;
  notes?: string;
  consumedAt: string; // ISO date string
};

export type FoodItemService = {
  getFoodItemById(
    id: string,
  ): Promise<{ id: string; name: string; calories?: number; proteins?: number; fats?: number; carbs?: number }>;
};

export type EnhancedMeal = Meal & {
  foodItemName: string;
  calories: number;
  proteins: number;
  fats: number;
  carbs: number;
};
