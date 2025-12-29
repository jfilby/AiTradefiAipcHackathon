import { BaseDataTypes } from '@/shared/types/base-data-types'
import { NarrationTones } from '@/types/elevenlabs-types'

export class ChatPromptsService {

  // Consts
  clName = 'ChatPromptsService'

  // Code
  getAnalysisPageChatPrompt(analysis: any) {

    // Debug
    const fnName = `${this.clName}.getAnalysisPageChatPrompt()`

    // console.log(`${fnName}: starting with analysis: ` +
    //             JSON.stringify(analysis))

    const narrationTones = JSON.stringify(NarrationTones)

    // Set the prompt
    var prompt =
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
          `## Tones\n` +
          `\n` +
          `You can optionally specify a tone with each message. The ` +
          `available tones are: ${narrationTones}\n` +
          `\n` +
          `## Example\n` +
          `\n` +
          `{\n` +
          `  "messages": [\n` +
          `    {\n` +
          `      "tone": "confident",\n` +
          `      "text": "I have updated the prompt for you.",\n` +
          `    }\n` +
          `  ],\n` +
          `  "prompt": "Look for small cap stocks with significant ` +
          `    revenue gain over the last 4 quarters."` +
          `}\n` +
          `\n` +
          `## Return fields\n` +
          `\n` +
          `The output includes these fields (see the example section for ` +
          `the expected structure):\n` +
          `- messages: the chat response goes here (markdown).\n` +
          `- name: a new name for the Analysis.\n` +
          `- description: a new description.\n` +
          `- prompt: a new prompt to screen instruments with.\n` +
          `\n` +
          `Don't set name, description or prompt fields unless the analysis ` +
          `is in draft status.\n` +
          `\n` +
          `The name, description and prompt fields should only be ` +
          `specified on confirmation by that they want these fields ` +
          `updated.\n`

    // Return
    return prompt
  }
}
