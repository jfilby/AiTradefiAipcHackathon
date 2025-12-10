import { Analysis, PrismaClient, Tech, UserProfile } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { UsersService } from '@/serene-core-server/services/users/service'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { SlideTypes } from '@/types/server-only-types'
import { ServerTestTypes } from '@/types/server-test-types'
import { AnalysisModel } from '@/models/trade-analysis/analysis-model'
import { SlideTemplateModel } from '@/models/slideshows/slide-template-model'
import { GetTechService } from '../tech/get-tech-service'
import { SlideTemplatesLlmService } from './llm-service'

// Models
const analysisModel = new AnalysisModel()
const getTechService = new GetTechService()
const slideTemplateModel = new SlideTemplateModel()

// Services
const slideTemplatesLlmService = new SlideTemplatesLlmService()
const usersService = new UsersService()

// Class
export class SlideTemplatesMutateService {

  // Consts
  clName = 'SlideTemplatesMutateService'

  // Code
  getPrompt(analysis: Analysis) {

    // Define prompt
    var prompt =
      `## General instructions\n` +
      `- You are defining a set of slides as part of a template.\n` +
      `- The prompt fields, when run, will have access to the requirements ` +
      `  of the analysis, as well the all relevant financial and stock ` +
      `  info.\n` +
      `## Type of slides\n` +
      JSON.stringify(Object.entries(SlideTypes)) +
      `\n\n` +
      `## Example\n` +
      `[\n` +
      `  {\n` +
      `    "type": "INT"\n` +
      `    "title": "<name>: 1 year outlook"\n` +
      `    "textPrompt": "Summarize NVDA"\n` +
      `    "audioPrompt": "Narrate an introduction to NVDA"\n` +
      `    "imagePrompt": "The logo for Nvidia with a bullish upward sign"\n` +
      `  },\n` +
      `  {\n` +
      `    "type": "REQ"\n` +
      `    "title": "Requirements"\n` +
      `    "textPrompt": "Summarize the analysis requirements"\n` +
      `    "audioPrompt": "Narrate a summary of the analysis requirements"\n` +
      `    "imagePrompt": "A magnifying glass"\n` +
      `  },\n` +
      `  {\n` +
      `    "type": "FIN"\n` +
      `    "title": "Financials"\n` +
      `    "textPrompt": "Summarize the last 3 years of the financials"\n` +
      `    "audioPrompt": "Narrate a summary of the last 3 years of the financials"\n` +
      `    "imagePrompt": null\n` +
      `  },\n` +
      `  {\n` +
      `    "type": "DCH"\n` +
      `    "title": "Daily chart"\n` +
      `    "textPrompt": "Summarize the daily chart"\n` +
      `    "audioPrompt": "Narrate a summary of the daily chart"\n` +
      `    "imagePrompt": null\n` +
      `  },\n` +
      `  {\n` +
      `    "type": "OUT"\n` +
      `    "title": "Conclusion"\n` +
      `    "textPrompt": "Summarize the trading report"\n` +
      `    "audioPrompt": "Narrate the trading report summary"\n` +
      `    "imagePrompt": "The logo for Nvidia with a bullish upward sign"\n` +
      `  }\n` +
      `]\n`

    // Return
    return prompt
  }

  async processQueryResults(
          prisma: PrismaClient,
          analysisId: string,
          queryResults: any) {

    // Create SlideTemplates
    var slideNo = 1

    for (const entry of queryResults.json) {

      // Create SlideTemplate
      const slideTemplate = await
              slideTemplateModel.create(
                prisma,
                analysisId,
                slideNo,
                entry.type,
                entry.title,
                entry.textPrompt,
                entry.audioPrompt,
                entry.imagePrompt)

      // Inc slideNo
      slideNo += 1
    }
  }

  async run(prisma: PrismaClient) {

    // Debug
    const fnName = `${this.clName}.run()`

    console.log(`${fnName}: starting..`)

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

    // Run each active analysis pending slide templates
    const analyses = await
            analysisModel.filterByNotExistsSlideTemplates(prisma)

    // Debug
    console.log(`${fnName}: analyses: ${analyses.length}`)

    // Process each Analysis record
    for (const analysis of analyses) {

      await this.runAnalysis(
              prisma,
              adminUserProfile.id,
              tech,
              analysis)
    }

    // Debug
    console.log(`${fnName}: completed`)
  }

  async runAnalysis(
          prisma: PrismaClient,
          userProfileId: string,
          tech: Tech,
          analysis: Analysis) {

    // Debug
    const fnName = `${this.clName}.runAnalysis()`

    // Get the prompt
    const prompt =
            this.getPrompt(analysis)

    // Debug
    // console.log(`${fnName}: prompt: ${prompt}`)

    // LLM request
    const { status, message, queryResults } = await
            slideTemplatesLlmService.llmRequest(
              prisma,
              userProfileId,
              tech,
              prompt)

    // Validate
    if (status === false) {
      throw new CustomError(`${fnName}: message: ${message}`)
    }

    // Process results
    await this.processQueryResults(
            prisma,
            analysis.id,
            queryResults)
  }
}
