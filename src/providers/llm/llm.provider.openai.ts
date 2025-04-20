import OpenAI from 'openai';
import {
  LlmProvider,
  CalculateMacrosInput,
  CalculateMacrosOutput,
  BuildChatMessageInput,
  ChatMessage,
} from './llm.provider';
import { z } from 'zod';

const CalculateMacrosResponseSchema = z.object({
  dish: z.string(),
  raw_weight_g: z.number(),
  cooked_weight_g: z.number(),
  yield: z.number(),
  calories: z.number(),
  proteins: z.number(),
  fats: z.number(),
  carbs: z.number(),
});

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
You are a nutrition‑calculation assistant.

When called to the function "calculate_macros", you must *only* return a JSON object that matches the function’s schema—no extra text.

Input format
------------
The user message contains two blocks:

Было
<ingredient‑1> <amount> <unit>
<ingredient‑2> <amount> <unit>
…

Стало
<number> g [optional dish name]

Typical units: g / гр, kg, ml / мл, L, шт / pcs.

Your tasks
----------
1. Dish name
   • If the user provided a name, use it.
   • Otherwise generate a short, two‑to‑three‑word name from the main ingredients (e.g. “Chicken‑Cream Stew”).

2. Parse raw ingredients
   • Extract ingredient, amount, unit from each “Было” line.
   • Convert everything to grams:
     – 1 kg = 1000 g, 1 L = 1000 ml, and assume 1 ml = 1 g unless density is specified.
     – For “шт” / pcs, apply typical weights (e.g. 1 egg = 60 g) or request clarification if unknown.

3. Lookup macros per 100 g (kcal, protein, fat, carbs) for every ingredient.
   Use a reliable reference or values supplied by the user.

4. Compute totals for raw mixture:
   RAW_weight_g, RAW_calories, RAW_proteins, RAW_fats, RAW_carbs.

5. Parse cooked weight
   • Extract the weight (integer grams) from the “Стало” line.

6. Calculate yield
   yield = cooked_weight_g / RAW_weight_g (round to 2 decimals).

7. Scale macros to the cooked dish
   calories = round(RAW_calories × yield)
   proteins = round(RAW_proteins × yield)
   fats = round(RAW_fats × yield)
   carbs = round(RAW_carbs × yield)

8. Output
   Respond **ONLY** with a valid JSON object (no extra text or markup) exactly in this shape:

{
  "dish": "<dish name>",
  "raw_weight_g": <integer>,
  "cooked_weight_g": <integer>,
  "yield": <float with 2 decimals>,
  "calories": <integer>,
  "proteins": <integer>,
  "fats": <integer>,
  "carbs": <integer>
}

Validation notes
----------------
* If a weight/unit cannot be determined, ask the user to clarify instead of guessing.
* Ensure all JSON numbers are numeric (not strings).
* Round yield to 2 decimals; all other values to whole numbers.
  `.trim(),
      }),

      ...input.messages,
    ];

    const functionDefinitions = [
      {
        name: 'calculate_macros',
        description: 'Compute nutrition macros and yield for a dish',
        parameters: {
          type: 'object',
          properties: {
            dish: { type: 'string' },
            raw_weight_g: { type: 'integer' },
            cooked_weight_g: { type: 'integer' },
            yield: { type: 'number' },
            calories: { type: 'integer' },
            proteins: { type: 'integer' },
            fats: { type: 'integer' },
            carbs: { type: 'integer' },
          },
          required: ['dish', 'raw_weight_g', 'cooked_weight_g', 'yield', 'calories', 'proteins', 'fats', 'carbs'],
        },
      },
    ];

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4.1',
      messages: messages,
      temperature: 0,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      functions: functionDefinitions,
      function_call: { name: 'calculate_macros' },
    });

    const choice = response.choices[0];

    if (!choice) {
      throw new Error('Failed to generate completion');
    }

    console.log('choice:', choice);

    const message = choice.message;

    const fnCall = message.function_call;

    if (!fnCall) {
      throw new Error('Function call not found in the response');
    }

    const result = CalculateMacrosResponseSchema.parse(JSON.parse(fnCall.arguments));

    console.log('result:', result);

    return {
      dish: result.dish,
      calories: result.calories,
      proteins: result.proteins,
      fats: result.fats,
      carbs: result.carbs,
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
