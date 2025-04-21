import { Meal } from './meal.model';

export interface MealRepository {
  createMeal(meal: Meal): Promise<Meal>;
  getMealsByDate(date: string): Promise<Meal[]>;
  listMeals(): Promise<Meal[]>;
  upsertMeal(mealId: string, meal: Meal): Promise<Meal>;
  updateMeal(mealId: string, meal: Partial<Meal>): Promise<Meal>;
  deleteMeal(mealId: string): Promise<void>;
}
