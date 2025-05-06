export type Settings = {
  llmKey: string;
  macroGoals: MacroGoals;
};

type MacroGoals = {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
};
