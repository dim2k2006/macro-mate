import { Meal } from './meal.model';
import { MealRepository } from './meal.repository';
import { MealService, CreateMealInput, FoodItemService, EnhancedMeal } from './meal.service';
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

  async createMeal(input: CreateMealInput): Promise<EnhancedMeal> {
    const meal: Meal = {
      id: uuidV4(),
      foodItemId: input.foodItemId,
      amount: input.amount,
      type: input.type,
      notes: input.notes,
      consumedAt: input.consumedAt,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const createdMeal = await this.mealRepository.createMeal(meal);

    return this.enhanceMeal(createdMeal);
  }

  async getMealsByDate(date: string): Promise<EnhancedMeal[]> {
    const meals = await this.mealRepository.getMealsByDate(date);

    return this.enhanceMeals(meals);
  }

  async listMeals(): Promise<EnhancedMeal[]> {
    const meals = await this.mealRepository.listMeals();

    return this.enhanceMeals(meals);
  }

  async upsertMeal(mealId: string, meal: Meal): Promise<EnhancedMeal> {
    meal.updatedAt = new Date().toISOString();

    const newMeal = await this.mealRepository.upsertMeal(mealId, meal);

    return this.enhanceMeal(newMeal);
  }

  async updateMeal(mealId: string, meal: Partial<Meal>): Promise<EnhancedMeal> {
    meal.updatedAt = new Date().toISOString();

    const newMeal = await this.mealRepository.updateMeal(mealId, meal);

    return this.enhanceMeal(newMeal);
  }

  async deleteMeal(mealId: string): Promise<void> {
    return this.mealRepository.deleteMeal(mealId);
  }

  async getMacrosByDate(date: string): Promise<{ calories: number; proteins: number; fats: number; carbs: number }> {
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
        acc.proteins += (foodItem.proteins || 0) * scale;
        acc.fats += (foodItem.fats || 0) * scale;
        acc.carbs += (foodItem.carbs || 0) * scale;

        return acc;
      },
      { calories: 0, proteins: 0, fats: 0, carbs: 0 },
    );

    return macros;
  }

  private async enhanceMeal(meal: Meal): Promise<EnhancedMeal> {
    const foodItem = await this.foodItemService.getFoodItemById(meal.foodItemId);

    if (!foodItem) {
      throw new Error(`Food item with ID ${meal.foodItemId} not found`);
    }

    const scale = meal.amount / 100;

    return {
      ...meal,
      foodItemName: foodItem.name,
      calories: (foodItem.calories || 0) * scale,
      proteins: (foodItem.proteins || 0) * scale,
      fats: (foodItem.fats || 0) * scale,
      carbs: (foodItem.carbs || 0) * scale,
    };
  }

  private async enhanceMeals(meals: Meal[]): Promise<EnhancedMeal[]> {
    return Promise.all(meals.map((meal) => this.enhanceMeal(meal)));
  }
}

export default MealServiceImpl;
