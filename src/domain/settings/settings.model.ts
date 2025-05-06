export type Settings = {
  llmKey: string;
  macroGoals: MacroGoals;
};

type MacroGoals = {
  calories: number;
  proteins: number;
  fats: number;
  carbs: number;
};
