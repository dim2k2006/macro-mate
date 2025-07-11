export type Settings = {
  llmKey: string;
  macroGoals: MacroGoals;
  lng: string;
};

type MacroGoals = {
  calories: number;
  proteins: number;
  fats: number;
  carbs: number;
};
