import { Meal } from './meal.model';
import { MealRepository } from './meal.repository';
import { MealService, CreateMealInput, FoodItemService } from './meal.service';
import { v4 as uuidV4 } from 'uuid';

type ConstructorInput = {
  mealRepository: MealRepository;
  foodItemService: FoodItemService;
};

export class MealServiceImpl implements MealService {
  private mealRepository: MealRepository;

  private foodItemService: FoodItemService;

  constructor({ mealRepository, foodItemService }: ConstructorInput) {
    this.mealRepository = mealRepository;

    this.foodItemService = foodItemService;
  }

  async createMeal(input: CreateMealInput): Promise<Meal> {
    const meal: Meal = {
      id: uuidV4(),
      foodItemId: input.foodItemId,
      amount: input.amount,
      notes: input.notes,
      consumedAt: input.consumedAt,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return this.mealRepository.createMeal(meal);
  }

  async getMealsByDate(date: string): Promise<Meal[]> {
    return this.mealRepository.getMealsByDate(date);
  }

  async listMeals(): Promise<Meal[]> {
    return this.mealRepository.listMeals();
  }

  async upsertMeal(mealId: string, meal: Meal): Promise<Meal> {
    meal.updatedAt = new Date().toISOString();

    return this.mealRepository.upsertMeal(mealId, meal);
  }

  async updateMeal(mealId: string, meal: Partial<Meal>): Promise<Meal> {
    meal.updatedAt = new Date().toISOString();

    return this.mealRepository.updateMeal(mealId, meal);
  }

  async deleteMeal(mealId: string): Promise<void> {
    return this.mealRepository.deleteMeal(mealId);
  }

  async getMacrosByDate(date: string): Promise<{ calories: number; protein: number; fat: number; carbs: number }> {
    const meals = await this.mealRepository.getMealsByDate(date);

    const foodItems = await Promise.all(meals.map((meal) => this.foodItemService.getFoodItemById(meal.foodItemId)));

    const macros = meals.reduce(
      (acc, meal) => {
        const foodItem = foodItems.find((item) => item.id === meal.foodItemId);

        if (!foodItem) {
          return acc;
        }

        const scale = meal.amount / 100;

        acc.calories += (foodItem.calories || 0) * scale;
        acc.protein += (foodItem.protein || 0) * scale;
        acc.fat += (foodItem.fat || 0) * scale;
        acc.carbs += (foodItem.carbs || 0) * scale;

        return acc;
      },
      { calories: 0, protein: 0, fat: 0, carbs: 0 },
    );

    return macros;
  }
}

export default MealServiceImpl;
