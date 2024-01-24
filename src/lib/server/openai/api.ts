import { OPEN_AI_KEY } from '$env/static/private';
import OpenAI from 'openai';
import { getPluginDescriptionPrompts } from './prompts/plugin-description';

const openai = new OpenAI({ apiKey: OPEN_AI_KEY });

const model = 'gpt-3.5-turbo';

export const generatePluginDescription = async (name: string, readme: string) => {
  const messages = getPluginDescriptionPrompts(name, readme);
  const r = await openai.chat.completions.create({ messages, model });
  console.log(r)
  return r.choices[0].message.content;
};

