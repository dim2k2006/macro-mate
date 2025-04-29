export type FoodItem = {
  id: string;
  state: 'cooking' | 'cooked';
  unit: Unit;
  description: string;
  name: string;
  calories?: number;
  proteins?: number;
  fats?: number;
  carbs?: number;
  ingredients?: FoodItem[];
  createdAt: string; // ISO
  updatedAt: string; // ISO
};

export type Unit = 'g' | 'ml';
