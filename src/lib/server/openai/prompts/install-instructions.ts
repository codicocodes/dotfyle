
import type { ChatCompletionMessage } from "openai/resources";

export const getInstallInstructionsPrompts = (owner: string, name: string, readme: string, pluginManager: string) => {
  return [
    {
      role: 'assistant',
      content:
        'Your task is to extract install code for a Neovim plugin based on the Readme.'
    },
    {
      role: 'assistant',
      content:
        `-- README BELOW -- \n${readme.substring(0, 10000)}`
    },
    {
      role: 'assistant',
      content:
        `Instructions should include \`${owner}/${name}\``
    },
    {
      role: 'assistant',
      content:
        `Only include code in your response. Do not include instructions. Do not include backticks to indicate it is code. The user already knows how to use the generated code.`
    },
    {
      role: 'user',
      content:
        `How to install this plugin with \`${pluginManager}\`?`
    },
  ] as ChatCompletionMessage[];
};
