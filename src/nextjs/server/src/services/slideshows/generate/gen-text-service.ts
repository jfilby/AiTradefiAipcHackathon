import { PrismaClient, SlideTemplate, Tech, TradeAnalysis } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { UsersService } from '@/serene-core-server/services/users/service'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { ServerTestTypes } from '@/types/server-test-types'
import { SlideModel } from '@/models/slideshows/slide-model'
import { SlideTemplateModel } from '@/models/slideshows/slide-template-model'
import { GenSlideTextLlmService } from './gen-text-llm-service'
import { GetTechService } from '../../tech/get-tech-service'
import { YFinanceQueryService } from '../../external-data/yfinance/query-service'

// Models
const slideModel = new SlideModel()
const slideTemplateModel = new SlideTemplateModel()

// Services
const genSlideTextLlmService = new GenSlideTextLlmService()
const getTechService = new GetTechService()
const yFinanceQueryService = new YFinanceQueryService()
const usersService = new UsersService()

// Class
export class GenSlideTextService {

  // Consts
  clName = 'GenSlideTextService'

  // Code
  async generate(
          prisma: PrismaClient,
          slideshowId: string,
          tradeAnalysis: TradeAnalysis,
          slideTemplates: SlideTemplate[]) {

    // Debug
    const fnName = `${this.clName}.generate()`

    // Get prompt
    const prompt = await
            this.getPrompt(
              prisma,
              tradeAnalysis,
              slideTemplates)

    // Debug
    console.log(`${fnName}: prompt: ${prompt}`)

    // Get adminUserProfile
    const adminUserProfile = await
            usersService.getUserProfileByEmail(
              prisma,
              ServerTestTypes.regularTestUserEmail)

    if (adminUserProfile == null) {
      throw new CustomError(`${fnName}: adminUserProfile == null`)
    }

    // Get Tech
    const tech = await
            getTechService.getStandardLlmTech(prisma)

    // Generate with an LLM
    const { status, message, queryResults } = await
            genSlideTextLlmService.llmRequest(
              prisma,
              adminUserProfile.id,
              tech,
              prompt)

    // Validate
    if (status === false) {
      throw new CustomError(`${fnName}: llmRequest() failed: ${message}`)
    }

    // Process queryResults
    const texts = await
            this.processQueryResults(
              prisma,
              slideshowId,
              (tradeAnalysis as any).tradeAnalysesGroup.analysisId,
              queryResults)

    // Return
    return texts
  }

  async getPrompt(
          prisma: PrismaClient,
          tradeAnalysis: TradeAnalysis,
          slideTemplates: SlideTemplate[]) {

    // Define the prompt
    var prompt =
      `## General instructions\n` +
      `- Generate slide data based on the slide templates plus instrument ` +
      `  data.\n` +
      `- Don't reference this system/agent ` +
      `  (${BaseDataTypes.aiTradefiAgentName}) in your slides unless ` +
      `  prompted to. Make it about the instrument that was analyzed.\n` +
      `- The title of each slide should reflect the slide type.\n` +
      `- The title of the first slide should reflect the name of the ` +
      `  slideshow and focus on the instrument analyzed.\n` +
      `- The slideNo of each slide template correlates it with each slide ` +
      `  with the same slideNo.\n` +
      `- Use the textPrompt of the slideTemplates to generate the text of ` +
      `  each slide.\n` +
      `- The slide text should make use of bullet points if making more ` +
      `  than one point. Use hyphens as bullet points, don't go more than ` +
      `  one level deep.\n` +
      `\n` +
      `## Narrated text\n` +
      `\n` +
      `- If a slideTemplate has an audioPrompt that use it to generate a ` +
      `  narratedText field.\n` +
      `- The narratedText should be 1-2 sentences:\n` +
      `  Sentence 1: restates the core point in natural language\n` +
      `  Sentence 2: adds insight or implication\n` +
      `\n` +
      `## Example\n` +
      `[\n` +
      `  {\n` +
      `    "slideNo": 1,\n` +
      `    "title": "NVDA as a long-term investment",\n` +
      `    "text": "This slideshow explains why NVDA is a good long-term ` +
      `    investment.",\n` +
      `    "narratedText": "Why NVDA is a good long-term investment."\n` +
      `  }\n` +
      `]\n` +
      `\n` +
      `## Slide templates\n`

    // Slide templates
    prompt += `[\n`

    var first = true

    for (const slideTemplate of slideTemplates) {

      if (first === true) {
        first = false
      } else {
        prompt += `,\n`
        first = false
      }

      prompt +=
        `  {\n` +
        `    "slideNo": ${slideTemplate.slideNo},\n` +
        `    "title": "${slideTemplate.title}",\n` +
        `    "textPrompt": "${slideTemplate.textPrompt}"\n`

      if (slideTemplate.audioPrompt != null) {
        prompt +=
          `    "audiotPrompt": "${slideTemplate.audioPrompt}"\n`
      }

      prompt +=
        `  }`
    }

    prompt += `\n]\n\n`

    // Continue the prompt
    prompt +=
      `## Instrument\n`

    // Instrument data
    const yFinanceContext = await
            yFinanceQueryService.getContext(
              prisma,
              tradeAnalysis.instrumentId)

    prompt +=
      JSON.stringify(yFinanceContext)

    // Return
    return prompt
  }

  async processQueryResults(
          prisma: PrismaClient,
          slideshowId: string,
          analysisId: string,
          queryResults: any) {

    // Debug
    const fnName = `${this.clName}.generate()`

    console.log(`${fnName}: queryResults.json: ` +
                JSON.stringify(queryResults.json))

    // Process entries
    for (const entry of queryResults.json) {

      // Get SlideTemplate
      const slideTemplate = await
              slideTemplateModel.getByUniqueKey(
                prisma,
                analysisId,
                entry.slideNo)

      // Upsert Slide (with new status)
      const slide = await
              slideModel.upsert(
                prisma,
                undefined,    // id
                slideshowId,
                slideTemplate.id,
                entry.slideNo,
                BaseDataTypes.newStatus,
                entry.title,
                entry.text,
                entry.narratedText,
                null,         // generatedAudioId
                null)         // generatedImageId
    }
  }
}
