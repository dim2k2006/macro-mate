import { Meal, MealType } from './meal.model';

export interface MealService {
  createMeal(input: CreateMealInput): Promise<EnhancedMeal>;
  getMealsByDate(date: string): Promise<EnhancedMeal[]>;
  listMeals(): Promise<EnhancedMeal[]>;
  upsertMeal(mealId: string, meal: Meal): Promise<EnhancedMeal>;
  updateMeal(mealId: string, meal: Partial<Meal>): Promise<EnhancedMeal>;
  deleteMeal(mealId: string): Promise<void>;
  getMacrosByDate(date: string): Promise<{ calories: number; protein: number; fat: number; carbs: number }>;
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
  ): Promise<{ id: string; calories?: number; protein?: number; fat?: number; carbs?: number }>;
};

export type EnhancedMeal = Meal & {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
};
