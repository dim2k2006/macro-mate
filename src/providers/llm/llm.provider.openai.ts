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
  raw_weight_g: z.number().int(),
  cooked_weight_g: z.number().int(),
  yield: z.number().min(0),
  total_calories: z.number().int(),
  total_proteins: z.number().int(),
  total_fats: z.number().int(),
  total_carbs: z.number().int(),
  per100_calories: z.number().min(0),
  per100_proteins: z.number().min(0),
  per100_fats: z.number().min(0),
  per100_carbs: z.number().min(0),
});

const ParseMacrosResponseSchema = z.object({
  dish: z.string(),
  per100_calories: z.number().min(0),
  per100_proteins: z.number().min(0),
  per100_fats: z.number().min(0),
  per100_carbs: z.number().min(0),
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
The user provides two blocks:

Было
<ingredient‑1> <amount> <unit>
<ingredient‑2> <amount> <unit>
…

Стало
<number> г [optional dish name]

Your job: calculate total macros of the cooked dish **and** macros per 100 g.

Follow these steps exactly
──────────────────────────
1. **Dish name**
   • If text follows the weight in “Стало”, use it.
   • Otherwise invent a concise ≤ 3‑word name from key ingredients.

2. **Parse raw ingredients**
   • Extract \`name\`, \`amount\`, \`unit\` from every “Было” line.
   • Convert all amounts to grams:
     – kg → ×1000 – L → ×1000 ml → g (assume 1 ml = 1 g unless density is specified)
     – ml / мл → g – “шт / pcs” → use typical mass (e.g. egg = 60 g) or ask.

3. **Macros per 100 g**
   Look up kcal, protein, fat, carbs per 100 g for each ingredient (or use values provided by the user).

4. **Totals for raw mixture**
    RAW_weight_g = Σ weight_g RAW_calories = Σ kcal_per100 * weight / 100 RAW_proteins = Σ protein_per100 * weight / 100 RAW_fats = Σ fat_per100 * weight / 100 RAW_carbs = Σ carb_per100 * weight / 100

5. **Cooked weight**
    Extract the integer grams in the “Стало” line → \`cooked_weight_g\`.

6. **Yield**
    yield = cooked_weight_g / RAW_weight_g // round to 2 decimals

7. **Scale macros to cooked dish**
    calories = round(RAW_calories) proteins = round(RAW_proteins) fats = round(RAW_fats) carbs = round(RAW_carbs)

8. **Macros per 100 g cooked**
    CAL_per100 = round(FINAL_calories * 100 / COOKED_weight_g, 1) PRO_per100 = round(FINAL_proteins * 100 / COOKED_weight_g, 1) FAT_per100 = round(FINAL_fats * 100 / COOKED_weight_g, 1) CARB_per100 = round(FINAL_carbs * 100 / COOKED_weight_g, 1)

9. **Output**
Respond **ONLY** with a valid JSON object in the exact shape below (no extra text):

{
  "dish": "<dish name>",
  "raw_weight_g": <integer>,
  "cooked_weight_g": <integer>,
  "yield": <float 2‑dec>,
  "total_calories": <integer>,
  "total_proteins": <integer>,
  "total_fats": <integer>,
  "total_carbs": <integer>,
  "per100_calories": <float 1‑dec>,
  "per100_proteins": <float 1‑dec>,
  "per100_fats": <float 1‑dec>,
  "per100_carbs": <float 1‑dec>
}

9. **Validation**
• If any amount or unit is missing/ambiguous, throw an error.
• Ensure all JSON numbers are numeric, not strings.
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
            total_calories: { type: 'integer' },
            total_proteins: { type: 'integer' },
            total_fats: { type: 'integer' },
            total_carbs: { type: 'integer' },
            per100_calories: { type: 'integer' },
            per100_proteins: { type: 'integer' },
            per100_fats: { type: 'integer' },
            per100_carbs: { type: 'integer' },
          },
          required: [
            'dish',
            'raw_weight_g',
            'cooked_weight_g',
            'yield',
            'total_calories',
            'total_proteins',
            'total_fats',
            'total_carbs',
            'per100_calories',
            'per100_proteins',
            'per100_fats',
            'per100_carbs',
          ],
        },
      },
    ];

    const response = await this.openai.chat.completions.create({
      model: 'o3',
      messages: messages,
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
      calories: result.per100_calories,
      proteins: result.per100_proteins,
      fats: result.per100_fats,
      carbs: result.per100_carbs,
    };
  }

  async parseMacros(input: CalculateMacrosInput): Promise<CalculateMacrosOutput> {
    const messages = [
      this.buildChatMessage({
        role: 'developer',
        content: `
You are a nutrition‑calculation assistant.
The user provides information about product and it's macros per 100 grams.

Your job: parse the provided macros and return them in a structured format.

**Output**
Respond **ONLY** with a valid JSON object in the exact shape below (no extra text):

{
  "dish": "<dish name>",
  "per100_calories": <float 1‑dec>,
  "per100_proteins": <float 1‑dec>,
  "per100_fats": <float 1‑dec>,
  "per100_carbs": <float 1‑dec>
}

9. **Validation**
• If any amount or unit is missing/ambiguous, throw an error.
• Ensure all JSON numbers are numeric, not strings.
  `.trim(),
      }),

      ...input.messages,
    ];

    const functionDefinitions = [
      {
        name: 'calculate_macros',
        description: 'Parse nutrition macros and yield for a product',
        parameters: {
          type: 'object',
          properties: {
            dish: { type: 'string' },
            per100_calories: { type: 'integer' },
            per100_proteins: { type: 'integer' },
            per100_fats: { type: 'integer' },
            per100_carbs: { type: 'integer' },
          },
          required: ['dish', 'per100_calories', 'per100_proteins', 'per100_fats', 'per100_carbs'],
        },
      },
    ];

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: messages,
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

    const result = ParseMacrosResponseSchema.parse(JSON.parse(fnCall.arguments));

    console.log('result:', result);

    return {
      dish: result.dish,
      calories: result.per100_calories,
      proteins: result.per100_proteins,
      fats: result.per100_fats,
      carbs: result.per100_carbs,
    };
  }

  async recognizeMacrosFromImage(input: File): Promise<CalculateMacrosOutput> {
    const base64 = await this.fileToBase64(input);

    const response = await this.openai.responses.create({
      model: 'gpt-4.1-mini',
      input: [
        {
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: `
You are a nutrition‑calculation assistant.
The user provides image of a product.

Your job: parse the provided macros and product name and return them in a structured format.

**Output**
Respond **ONLY** with a valid JSON object in the exact shape below (no extra text):

{
  "dish": "<product name>",
  "per100_calories": <float 1‑dec>,
  "per100_proteins": <float 1‑dec>,
  "per100_fats": <float 1‑dec>,
  "per100_carbs": <float 1‑dec>
}

9. **Validation**
• If any amount or unit is missing/ambiguous, throw an error.
• Ensure all JSON numbers are numeric, not strings.
            `.trim(),
            },
            {
              type: 'input_image',
              image_url: `data:image/jpeg;base64,${base64}`,
              detail: 'auto',
            },
          ],
        },
      ],
    });

    console.log(response.output_text);

    const result = ParseMacrosResponseSchema.parse(JSON.parse(response.output_text));

    return {
      dish: result.dish,
      calories: result.per100_calories,
      proteins: result.per100_proteins,
      fats: result.per100_fats,
      carbs: result.per100_carbs,
    };
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1]; // убираем data:image/jpeg;base64,
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  buildChatMessage(input: BuildChatMessageInput): ChatMessage {
    return {
      role: input.role,
      content: input.content,
    };
  }
}

export default LlmProviderOpenai;
