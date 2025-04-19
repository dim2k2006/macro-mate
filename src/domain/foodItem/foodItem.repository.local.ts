import localForage from 'localforage';
import { FoodItem } from './foodItem.model';
import { FoodItemRepository } from './foodItem.repository';

class FoodItemRepositoryLocal implements FoodItemRepository {
  private readonly storageKey = 'foodItems';

  constructor() {
    this.storageKey = 'foodItems';
  }

  async createFoodItem(foodItem: FoodItem): Promise<FoodItem> {
    const foodItems = await this.listFoodItems();

    foodItems.push(foodItem);

    await localForage.setItem(this.storageKey, foodItems);

    return foodItem;
  }

  async getFoodItemById(id: string): Promise<FoodItem> {
    const foodItems = await this.listFoodItems();
    const foodItem = foodItems.find((item) => item.id === id);

    if (!foodItem) {
      throw new Error(`Food item with id ${id} not found`);
    }

    return foodItem;
  }

  async listFoodItems(): Promise<FoodItem[]> {
    const foodItems = await localForage.getItem<FoodItem[]>(this.storageKey);
    return foodItems || [];
  }

  async updateFoodItem(id: string, foodItem: FoodItem): Promise<FoodItem> {
    const foodItems = await this.listFoodItems();
    const index = foodItems.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new Error(`Food item with id ${id} not found`);
    }

    foodItems[index] = { ...foodItems[index], ...foodItem };

    await localForage.setItem(this.storageKey, foodItems);

    return foodItems[index];
  }

  async deleteFoodItem(id: string): Promise<void> {
    const foodItems = await this.listFoodItems();
    const index = foodItems.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new Error(`Food item with id ${id} not found`);
    }

    foodItems.splice(index, 1);

    await localForage.setItem(this.storageKey, foodItems);
  }
}

export default FoodItemRepositoryLocal;
