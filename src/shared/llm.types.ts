export interface LlmProvider {
  buildChatMessage(input: BuildChatMessageInput): ChatMessage;
  calculateMacros(input: CalculateMacrosInput): Promise<CalculateMacrosOutput>;
}

export type CalculateMacrosInput = {
  messages: ChatMessage[];
};

export type CalculateMacrosOutput = {
  calories: number;
  proteins: number;
  fats: number;
  carbs: number;
};

export type ChatMessage = {
  role: Role;
  content: string;
};

export type ChatCompletion = {
  content: string;
};

type Role = 'developer' | 'user';

export type BuildChatMessageInput = {
  role: Role;
  content: string;
};
