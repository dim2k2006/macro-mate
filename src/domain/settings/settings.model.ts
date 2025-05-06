export type Settings = {
  llmKey: LlmKey;
  macroGoals: MacroGoals;
};

type LlmKey = {
  id: string;
  key: string;
  createdAt: string;
  updatedAt: string;
};

type MacroGoals = {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
};
