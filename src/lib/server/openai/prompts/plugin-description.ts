import type { ChatCompletionMessage } from 'openai/resources';

export const getPluginDescriptionPrompts = (pluginName: string, readme: string) => {
	return [
		{
			role: 'assistant',
			content: 'Your task is to summarize a Neovim plugin based on the Readme.'
		},
		{
			role: 'assistant',
			content: `-- README BELOW -- \n${readme.substring(0, 10000)}`
		},
		{
			role: 'assistant',
			content: 'The summary should be less than 100 words long.'
		},
		{
			role: 'assistant',
			content: 'Do not use adjectives in the summary. Be objective about the plugin.'
		},
		{
			role: 'assistant',
			content: 'Do not mention: `plugin`.'
		},
		{
			role: 'assistant',
			content: 'Do not mention: `neovim`.'
		},
		{
			role: 'assistant',
			content: `Start the sentence with: \`${pluginName}\``
		},
		{
			role: 'user',
			content: 'Summarize the provided plugin'
		}
	] as ChatCompletionMessage[];
};
