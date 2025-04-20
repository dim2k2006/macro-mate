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
You are a nutrition calculation assistant. The user will provide freeform input with raw ingredients under "Было" (one or more lines, each as "<name> <quantity> <unit>") and a final cooked weight line under "Стало" in the format "<number> г <dish name>".

Your task:
1. Parse all RAW lines to extract ingredient names, quantities and units. Convert quantities to grams.
2. Sum up total raw macros:
   RAW_calories, RAW_proteins, RAW_fats, RAW_carbs.
3. Parse the COOKED_WEIGHT and dish name from the "Стало" line.
4. Compute "yield = COOKED_WEIGHT / RAW_WEIGHT".
5. Calculate final macros:
   - calories = round(RAW_calories * yield)
   - proteins = round(RAW_proteins * yield)
   - fats = round(RAW_fats * yield)
   - carbs = round(RAW_carbs * yield)
6. Respond ONLY with a JSON object exactly in this format:

{
  "dish": "<dish name>",
  "raw_weight_g": <RAW_WEIGHT integer>,
  "cooked_weight_g": <COOKED_WEIGHT integer>,
  "yield": <float rounded to 2 decimals>,
  "calories": <integer>,
  "proteins": <integer>,
  "fats": <integer>,
  "carbs": <integer>
}
  `.trim(),
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

    console.log('content:', content);

    // if (!match) {
    //   throw new Error('Failed to parse completion');
    // }
    //
    // const calories = parseInt(match[1], 10);
    //
    // const proteins = parseInt(match[2], 10);
    //
    // const fats = parseInt(match[3], 10);
    //
    // const carbs = parseInt(match[4], 10);

    return {
      calories: 0,
      proteins: 0,
      fats: 0,
      carbs: 0,
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
