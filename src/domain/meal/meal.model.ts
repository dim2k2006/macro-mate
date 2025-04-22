export type Meal = {
  id: string;
  foodItemId: string;
  amount: number; // number of grams or milliliters
  notes?: string;
  type: MealType;
  consumedAt: string; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
