import { Meal } from './meal.model';

export interface MealRepository {
  createMeal(meal: Meal): Promise<Meal>;
  getMealsByDate(date: string): Promise<Meal[]>;
  updateMeal(mealId: string, meal: Partial<Meal>): Promise<Meal>;
  deleteMeal(mealId: string): Promise<void>;
}
