import { Analysis, Exchange, PrismaClient, Tech } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { TechModel } from '@/serene-core-server/models/tech/tech-model'
import { UsersService } from '@/serene-core-server/services/users/service'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { ServerOnlyTypes } from '@/types/server-only-types'
import { ServerTestTypes } from '@/types/server-test-types'
import { AnalysisModel } from '@/models/trade-analysis/analysis-model'
import { AnalysisTechModel } from '@/models/trade-analysis/analysis-tech-model'
import { ExchangeModel } from '@/models/instruments/exchange-model'
import { InstrumentModel } from '@/models/instruments/instrument-model'
import { TradeAnalysisModel } from '@/models/trade-analysis/trade-analysis-model'
import { TradeAnalysisLlmService } from './llm-service'

// Models
const analysisModel = new AnalysisModel()
const analysisTechModel = new AnalysisTechModel()
const exchangeModel = new ExchangeModel()
const instrumentModel = new InstrumentModel()
const techModel = new TechModel()
const tradeAnalysisModel = new TradeAnalysisModel()

// Services
const tradeAnalysisLlmService = new TradeAnalysisLlmService()
const usersService = new UsersService()

// Class
export class TradeAnalysisMutateService {

  // Consts
  clName = 'TradeAnalysisMutateService'

  // Code
  getPrompt(
    type: string,
    analysisPrompt: string,
    exchangeNames: string[],
    instruments: string[],
    instrumentNamesAlreadyRun: string[]) {

    var prompt =
          `## Instructions\n` +
          `Generate analysis results, in JSON, for 3 instruments of type ` +
          `${type} as shown in the example section.\n` +
          `\n` +
          `## Analysis thesis\n` +
          `${analysisPrompt}\n` +
          `\n` +
          `## Exchanges\n` +
          `Only include for exchanges: ` +
          exchangeNames.join(', ') + `\n` +
          `\n`

    if (instruments.length > 0) {

      prompt +=
        `## Instruments\n` +
        `Only for these instruments: ` +
        instruments.join(', ') + `\n` +
        `\n`
    }

    prompt +=
      `## Don't include\n` +
      `Don't include any analysis for these instruments: ` +
      instrumentNamesAlreadyRun.join(', ') + `\n` +
      `\n` +
      `## Fields\n` +
      `Take note of these fields in the output:\n` +
      `- tradeType: recommend a B (buy) or S (sell)\n` +
      `- score: the score from 0..1 by the analysis thesis\n` +
      `\n` +
      `## Example\n` +
      `{\n` +
      `  "exchange": "NASDAQ",\n` +
      `  "instrument": "NVDA",\n` +
      `  "tradeType": "B",\n` +
      `  "score": 0.85,\n` +
      `  "thesis": "Consistent sales increases..` +
      `}\n`

    return prompt
  }

  async processQueryResults(
          prisma: PrismaClient,
          analysisId: string,
          techId: string,
          instrumentType: string,
          queryResults: any): Promise<string[]> {

    // Get day
    const day = new Date()

    // Process each entry
    var instruments: string[] = []

    for (const entry of queryResults.json) {

      // Get Exchange
      const exchange = await
              exchangeModel.getByUniqueKey(
                prisma,
                entry.exchange)

      // Get Instrument
      const instrument = await
              instrumentModel.upsert(
                prisma,
                undefined,  // id
                exchange.id,
                entry.instrument,
                instrumentType,
                entry.instrument)

      // Create TradeAnalysis
      await tradeAnalysisModel.create(
              prisma,
              instrument.id,
              analysisId,
              techId,
              day,
              ServerOnlyTypes.tradeAnalysisEngineVersion,
              BaseDataTypes.activeStatus,
              entry.tradeType,
              entry.score,
              entry.thesis)

      // Save instrument name
      instruments.push(entry.instrument)
    }

    // Return
    return instruments
  }

  async run(prisma: PrismaClient) {

    // Debug
    const fnName = `${this.clName}.run()`

    // Get the admin UserProfile
    const adminUserProfile = await
            usersService.getUserProfileByEmail(
              prisma,
              ServerTestTypes.adminUserEmail)

    if (adminUserProfile == null) {
      throw new CustomError(`${fnName}: adminUserProfile == null`)
    }

    // Get exchanges
    // Run each available analysis
    const analyses = await
            analysisModel.filter(
              prisma,
              undefined,  // type
              BaseDataTypes.activeStatus)

    for (const analysis of analyses) {

      // Get leading analysis tech
      const leadingAnalysisTechs = await
              analysisTechModel.filter(
                prisma,
                analysis.id,
                undefined,  // techId
                BaseDataTypes.activeStatus,
                true)       // isLeaderTech

      if (leadingAnalysisTechs.length === 0) {
        throw new CustomError(`${fnName}: leadingAnalysisTechs.length === 0`)
      }

      // Get tech
      var tech = await
            techModel.getById(
              prisma,
              leadingAnalysisTechs[0].techId)

      // Run the analysis for the leading techId
      const instruments = await
              this.runAnalysis(
                prisma,
                adminUserProfile.id,
                analysis,
                tech,
                [])  // instruments

      // Get non-leading analysis tech
      const nonLeadingAnalysisTechs = await
              analysisTechModel.filter(
                prisma,
                analysis.id,
                undefined,  // techId
                BaseDataTypes.activeStatus,
                false)      // isLeaderTech

      if (leadingAnalysisTechs.length === 0) {
        throw new CustomError(`${fnName}: leadingAnalysisTechs.length === 0`)
      }

      // Generate for techs that mirror the leading one
      for (const nonLeadingAnalysisTech of nonLeadingAnalysisTechs) {

        // Get tech
        tech = await
          techModel.getById(
            prisma,
            leadingAnalysisTechs[0].techId)

        await this.runAnalysis(
                prisma,
                adminUserProfile.id,
                tech,
                tech,
                instruments)
      }
    }
  }

  async runAnalysis(
          prisma: PrismaClient,
          userProfileId: string,
          analysis: Analysis,
          tech: Tech,
          instruments: string[]): Promise<string[]> {

    // Debug
    const fnName = `${this.clName}.runAnalysis()`

    // Instrument type
    const instrumentType = ServerOnlyTypes.stockType

    // Get exchanges
    const exchanges = await
            exchangeModel.getByRegionAndInstrumentType(
              prisma,
              undefined,  // region
              instrumentType)

    // Validate
    if (exchanges == null) {
      throw new CustomError(`${fnName}: exchanges == null`)
    }

    // Get exchange names
    const exchangeNames =
            exchanges.map(
              (exchange: Exchange) => exchange.name)

    // Don't rerun an existing instrument for an analysis for at least 90 days
    const instrumentsAlreadyRun = await
            instrumentModel.getWithRecentTradeAnalysis(
              prisma,
              ServerOnlyTypes.stockType,
              analysis.id,
              90)  // daysAgo

    const instrumentNamesAlreadyRun =
            instrumentsAlreadyRun.map(
              (instrumentAlreadyRun) => instrumentAlreadyRun.name)

    // Get the prompt
    const prompt =
            this.getPrompt(
              analysis.instrumentType,
              analysis.prompt,
              exchangeNames,
              instruments,
              instrumentNamesAlreadyRun)

    // LLM request
    const { status, message, queryResults } = await
            tradeAnalysisLlmService.llmRequest(
              prisma,
              userProfileId,
              tech,
              prompt)

    // Validate
    if (status === false) {
      throw new CustomError(`${fnName}: message: ${message}`)
    }

    // Debug
    console.log(`${fnName}: queryResults: ` + JSON.stringify(queryResults))

    // Process
    const returningInstruments = await
            this.processQueryResults(
              prisma,
              analysis.id,
              tech.id,
              instrumentType,
              queryResults)

    // Return
    return returningInstruments
  }
}
