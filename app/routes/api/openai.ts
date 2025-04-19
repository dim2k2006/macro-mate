import { json } from '@remix-run/node';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const action = async ({ request }) => {
  const { items } = await request.json();
  const prompt = `Calculate calories, proteins, fats, and carbs for: ${items.join(', ')}`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
  });

  return json({ result: completion.choices[0].message.content });
};
