import { PrismaClient, SlideTemplate, Tech } from '@prisma/client'
import { GenSlideTextLlmService } from './gen-text-llm-service'

// Services
const genSlideTextLlmService = new GenSlideTextLlmService()

// Class
export class GenSlideTextService {

  // Consts
  clName = 'GenSlideTextService'

  // Code
  async generate(
          prisma: PrismaClient,
          slideshowId: string,
          slideTemplates: SlideTemplate[]) {

    // TODO: generate texts for all slides in a single LLM request
    // Get prompt
    ;

    // Generate with an LLM
    ;

    // Process queryResults
    ;
  }

  getPrompt(slideTemplates: SlideTemplate[]) {

    // Define the prompt
    var prompt =
      `## General instructions\n` +
      `Generate slide data based on the slide templates plus instrument ` +
      `information.\n` +
      `\n` +
      `## Slide templates\n`

    // Slide templates
    prompt +=
      JSON.stringify(slideTemplates)

    // Continue the prompt
    prompt +=
      `\n` +
      `## Instrument\n`

    // Instrument data
    // TODO

    // Continue the prompt
    prompt +=
      `\n` +
      `## Example\n` +
      `[\n` +
      `  {\n` +
      `    "slideNo": 1,\n` +
      `    "text": "output.."\n` +
      `  }\n` +
      `]\n`

    // Return
    return prompt
  }
}
