export type Meal = {
  id: string;
  foodItemId: string;
  amount: number; // number of grams or milliliters
  notes?: string;
  consumedAt: string; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};
