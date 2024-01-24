import type { ChatCompletionMessage } from "openai/resources";

export const getPluginDescriptionPrompts = (pluginName: string, readme: string) => {
  return [
    {
      role: 'assistant',
      content: 'You are a helpful assistant specialized in Neovim plugins.'
    },
    {
      role: 'assistant',
      content:
        'Your task is to summarize the purpose of a Neovim plugin based on the Readme'
    },
    {
      role: 'assistant',
      content:
        'The summary should be less than 100 words long.'
    },
    {
      role: 'assistant',
      content:
        'Do not use adjectives in the summary. Be objective about the purpose of the plugin.'
    },
    {
      role: 'assistant',
      content:
        'Do not mention: `plugin`'
    },
    {
      role: 'assistant',
      content:
        'Do not mention: `neovim`'
    },
    {
      role: 'assistant',
      content:
        `Do not mention: \`${pluginName}\``
    },
    {
      role: 'assistant',
      content:
        `-- README BELOW -- \n${readme.substring(0, 10000)}`
    },
    {
      role: 'user',
      content:
        'Summarize the provided plugin'
    },
  ] as ChatCompletionMessage[];
};
