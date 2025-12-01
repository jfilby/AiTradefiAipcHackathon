import { Analysis, Exchange, PrismaClient } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { ServerOnlyTypes } from '@/types/server-only-types'
import { AnalysisModel } from '@/models/trade-analysis/analysis-model'
import { ExchangeModel } from '@/models/instruments/exchange-model'
import { InstrumentModel } from '@/models/instruments/instrument-model'
import { TechModel } from '@/serene-core-server/models/tech/tech-model'
import { TradeAnalysisModel } from '@/models/trade-analysis/trade-analysis-model'
import { GetTechService } from '../tech/get-tech-service'
import { TradeAnalysisLlmService } from './llm-service'

// Models
const analysisModel = new AnalysisModel()
const exchangeModel = new ExchangeModel()
const instrumentModel = new InstrumentModel()
const techModel = new TechModel()
const tradeAnalysisModel = new TradeAnalysisModel()

// Services
const getTechService = new GetTechService()
const tradeAnalysisLlmService = new TradeAnalysisLlmService()

// Class
export class TradeAnalysisMutateService {

  // Consts
  clName = 'TradeAnalysisMutateService'

  // Code
  getPrompt(
    type: string,
    analysisPrompt: string,
    exchangeNames: string[],
    instrumentNamesAlreadyRun: string[]) {

    const prompt =
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
            `\n` +
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
            `  "score": 0.85\n` +
            `}\n`

    return prompt
  }

  async processQueryResults(
          prisma: PrismaClient,
          analysisId: string,
          queryResults: any) {

    // Get day
    const day = new Date()

    // Process each entry
    for (const entry of queryResults.json) {

      // Get Exchange
      const exchange = await
              exchangeModel.getByUniqueKey(
                prisma,
                entry.exchange)

      // Get Instrument
      const instrument = await
              instrumentModel.getByUniqueKey(
                prisma,
                exchange.id,
                entry.instrument)

      // Create TradeAnalysis
      await tradeAnalysisModel.create(
              prisma,
              instrument.id,
              analysisId,
              day,
              BaseDataTypes.activeStatus,
              entry.tradeType,
              entry.score)
    }
  }

  async run(prisma: PrismaClient,
            userProfileId: string) {

    // Run each available analysis
    const analyses = await
            analysisModel.filter(
              prisma,
              BaseDataTypes.activeStatus)

    for (const analysis of analyses) {

      await this.runAnalysis(
              prisma,
              userProfileId,
              analysis)
    }
  }

  async runAnalysis(
          prisma: PrismaClient,
          userProfileId: string,
          analysis: Analysis) {

    // Debug
    const fnName = `${this.clName}.runAnalysis()`

    // Get exchanges
    const exchanges = await
            exchangeModel.getByRegionAndInstrumentType(
              prisma,
              undefined,  // region
              ServerOnlyTypes.stockType)

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

    const tech = await
            techModel.getById(
              prisma,
              analysis.techId)

    // Get the prompt
    const prompt =
            this.getPrompt(
              analysis.instrumentType,
              analysis.prompt,
              exchangeNames,
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
    await this.processQueryResults(
            prisma,
            analysis.id,
            queryResults)
  }
}
