import { Meal } from './meal.model';

export interface MealService {
  createMeal(meal: Meal): Promise<Meal>;
  getMealsByDate(date: string): Promise<Meal[]>;
  listMeals(): Promise<Meal[]>;
  upsertMeal(mealId: string, meal: Meal): Promise<Meal>;
  updateMeal(mealId: string, meal: Partial<Meal>): Promise<Meal>;
  deleteMeal(mealId: string): Promise<void>;
  getMacrosByDate(date: string): Promise<{ calories: number; protein: number; fat: number; carbs: number }>;
}
