import { OPEN_AI_KEY } from '$env/static/private';
import OpenAI from 'openai';
import { getInstallInstructionsPrompts } from './prompts/install-instructions';
import { getPluginDescriptionPrompts } from './prompts/plugin-description';

const openai = new OpenAI({ apiKey: OPEN_AI_KEY });

const model = 'gpt-3.5-turbo';

export const generatePluginDescription = async (name: string, readme: string) => {
  const messages = getPluginDescriptionPrompts(name, readme);
  const r = await openai.chat.completions.create({ messages, model });
  return r.choices[0].message.content;
};

export const generateInstallInstructions = async (
  owner: string,
  name: string,
  readme: string,
  pluginManager: string
) => {
  const messages = getInstallInstructionsPrompts(owner, name, readme, pluginManager);
  const r = await openai.chat.completions.create({ messages, model });
  return r.choices[0].message.content;
};
