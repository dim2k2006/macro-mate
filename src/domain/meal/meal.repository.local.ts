import localForage from 'localforage';
import { Meal } from './meal.model';
import { MealRepository } from './meal.repository';
import dayjs from 'dayjs';

class MealRepositoryLocal implements MealRepository {
  private readonly storageKey: string;

  constructor() {
    this.storageKey = 'meals';
  }

  async createMeal(meal: Meal): Promise<Meal> {
    const meals = await this.listMeals();

    meals.push(meal);

    await localForage.setItem(this.storageKey, meals);

    return meal;
  }

  async getMealsByDate(date: string): Promise<Meal[]> {
    const meals = await this.listMeals();

    const day = dayjs(date).startOf('day');

    return meals.filter((meal) => dayjs(meal.consumedAt).isSame(day));
  }

  async listMeals(): Promise<Meal[]> {
    const meals = await localForage.getItem<Meal[]>(this.storageKey);
    return meals || [];
  }

  async updateMeal(mealId: string, meal: Partial<Meal>): Promise<Meal> {
    const meals = await this.listMeals();
    const index = meals.findIndex((item) => item.id === mealId);

    if (index === -1) {
      throw new Error(`Meal with id ${mealId} not found`);
    }

    meals[index] = { ...meals[index], ...meal };

    await localForage.setItem(this.storageKey, meals);

    return meals[index];
  }

  async deleteMeal(mealId: string): Promise<void> {
    const meals = await this.listMeals();
    const index = meals.findIndex((item) => item.id === mealId);

    if (index === -1) {
      throw new Error(`Meal with id ${mealId} not found`);
    }

    meals.splice(index, 1);

    await localForage.setItem(this.storageKey, meals);
  }

  async upsertMeal(mealId: string, meal: Meal): Promise<Meal> {
    const meals = await this.listMeals();
    const index = meals.findIndex((item) => item.id === mealId);

    if (index === -1) {
      meals.push(meal);
    } else {
      meals[index] = { ...meals[index], ...meal };
    }

    await localForage.setItem(this.storageKey, meals);

    return meal;
  }
}

export default MealRepositoryLocal;
