import OpenAI from 'openai';
import {
  LlmProvider,
  CalculateMacrosInput,
  CalculateMacrosOutput,
  BuildChatMessageInput,
  ChatMessage,
} from './llm.provider';

type ConstructorInput = {
  apiKey: string;
};

class LlmProviderOpenai implements LlmProvider {
  private openai: OpenAI;

  constructor({ apiKey }: ConstructorInput) {
    this.openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true,
    });
  }

  async calculateMacros(input: CalculateMacrosInput): Promise<CalculateMacrosOutput> {
    const messages = [
      this.buildChatMessage({
        role: 'developer',
        content: `
TODO create promprt for calculating macros
        `,
      }),
      ...input.messages,
    ];

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
    });

    const choice = response.choices[0];

    if (!choice) {
      throw new Error('Failed to generate completion');
    }

    const content = choice.message.content ?? '';

    const regex = /calories:\s*(\d+)\s*proteins:\s*(\d+)\s*fats:\s*(\d+)\s*carbs:\s*(\d+)/i;

    const match = content.match(regex);

    if (!match) {
      throw new Error('Failed to parse completion');
    }

    const calories = parseInt(match[1], 10);

    const proteins = parseInt(match[2], 10);

    const fats = parseInt(match[3], 10);

    const carbs = parseInt(match[4], 10);

    return {
      calories,
      proteins,
      fats,
      carbs,
    };
  }

  buildChatMessage(input: BuildChatMessageInput): ChatMessage {
    return {
      role: input.role,
      content: input.content,
    };
  }
}

export default LlmProviderOpenai;
