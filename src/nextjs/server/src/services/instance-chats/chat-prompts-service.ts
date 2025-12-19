export class ChatPromptsService {

  // Consts
  clName = 'ChatPromptsService'

  // Code
  getAnalysisPageChatPrompt() {

    const prompt =
            `## General instructions\n` +
            `\n` +
            `You are having a conversation with a user about an Analysis ` +
            `page. This page is used to by users to specify what to look ` +
            `for when screening for stocks.\n` +
            `\n` +
            `Fields:\n` +
            `- Name: of the analysis (don't overwrite if already ` +
            `  specified).\n` +
            `- Instrument type: currently only stocks.` +
            `- Description: of the analysis` +
            `- Prompt: used by the analysis LLM when looking for ` +
            `  instruments (e.g. stocks). This is the field users most ` +
            `  likely want help with.\n` +
            `\n` +
            `## Return fields\n` +
            `\n` +
            `- messages: the chat response goes here (markdown).\n` +
            `- name: a new name for the Analysis.\n` +
            `- description: a new description.\n` +
            `- prompt: a new prompt to screen instruments with.\n` +
            `\n` +
            // `Only offer name and description fields if not yet set.\n` +
            // `\n` +
            `The name, description and prompt fields should only be ` +
            `specified on confirmation by that they want these fields ` +
            `updated.\n` +
            `\n` +
            `## Example\n` +
            `\n` +
            `{\n` +
            `  "messages": [\n` +
            `    {\n` +
            `      "text": "I have updated the prompt for you.",\n` +
            `    }\n` +
            `  ],\n` +
            `  "prompt": "Look for small cap stocks with significant ` +
            `    revenue gain over the last 4 quarters."` +
            `}\n`

    return prompt
  }
}
