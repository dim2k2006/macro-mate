export interface LlmProvider {
  buildChatMessage(input: BuildChatMessageInput): ChatMessage;
  calculateMacros(input: CalculateMacrosInput): Promise<CalculateMacrosOutput>;
  parseMacros(input: CalculateMacrosInput): Promise<CalculateMacrosOutput>;
  recognizeMacrosFromImage(input: File): Promise<CalculateMacrosOutput>;
}

export type CalculateMacrosInput = {
  messages: ChatMessage[];
};

export type CalculateMacrosOutput = {
  dish: string;
  calories: number;
  proteins: number;
  fats: number;
  carbs: number;
};

export type ChatMessage = {
  role: Role;
  content: string;
};

type Role = 'developer' | 'user';

export type BuildChatMessageInput = {
  role: Role;
  content: string;
};
