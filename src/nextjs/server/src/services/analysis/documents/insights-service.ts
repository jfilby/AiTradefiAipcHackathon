import { PrismaClient, WindowType } from '@prisma/client'
import { AgentUserModel } from '@/serene-ai-server/models/agents/agent-user-model'
import { AgentLlmService } from '@/serene-ai-server/services/llm-apis/agent-llm-service'
import { CustomError } from '@/serene-core-server/types/errors'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { ServerOnlyTypes } from '@/types/server-only-types'
import { TradingParameterTypes } from '@/types/trading-parameter-types'
import { InstrumentModel } from '@/models/instruments/instrument-model'
import { ExchangeModel } from '@/models/instruments/exchange-model'
import { DocumentModel } from '@/models/documents/document-model'
import { DocWindowInsightModel } from '@/models/documents/doc-window-insight-model'
import { WindowTypeModel } from '@/models/instruments/window-type-model'
import { GetTechService } from '@/services/tech/get-tech-service'
import { WindowTypesService } from '@/services/window-types/service'

// Models
const agentUserModel = new AgentUserModel()
const exchangeModel = new ExchangeModel()
const documentModel = new DocumentModel()
const docWindowInsightModel = new DocWindowInsightModel()
const instrumentModel = new InstrumentModel()
const windowTypeModel = new WindowTypeModel()

// Services
const agentLlmService = new AgentLlmService()
const getTechService = new GetTechService()
const windowTypesService = new WindowTypesService()

// Class
export class DocInsightsService {

  // Consts
  clName = 'DocInsightsService'

  // Code
  async processQueryResults(
          prisma: PrismaClient,
          windowTypeId: string,
          instrumentId: string,
          agentUserId: string,
          queryResults: any) {

    // Debug
    const fnName = `${this.clName}.processQueryResults()`

    console.log(`${fnName}: queryResults: ` + JSON.stringify(queryResults))

    // Get the JSON
    const json = queryResults.json

    // Upsert DocWindowInsight
    const docWindowInsight = await
            docWindowInsightModel.upsert(
              prisma,
              undefined,  // id
              windowTypeId,
              instrumentId,
              agentUserId,
              BaseDataTypes.activeStatus,
              json.advisedTradeType,
              ServerOnlyTypes.generalNewsCategory,
              json.sentimentScore,
              json.confidenceScore,
              json.potencyScore,
              json.noveltyScore,
              json.urgencyScore,
              new Date(),
              null)       // ending
  }

  async run(prisma: PrismaClient,
            userProfileId: string) {

    // Get the Nasdaq exchange
    const nasdaqExchange = await
            exchangeModel.getByUniqueKey(
              prisma,
              ServerOnlyTypes.nasdaqExchangeName)

    // Get the WindowTypes
    const windowTypes = await
            windowTypeModel.filter(prisma)

    // Run per instrument on the Nasdaq
    for (const entry of TradingParameterTypes.nasdaqStocks) {

      // Run per WindowType
      for (const windowType of windowTypes) {

        await this.runForSymbolAndWindowType(
                prisma,
                userProfileId,
                nasdaqExchange.id,
                entry.symbol,
                windowType)
      }
    }
  }

  async runForSymbolAndWindowType(
          prisma: PrismaClient,
          userProfileId: string,
          exchangeId: string,
          symbol: string,
          windowType: WindowType) {

    // Debug
    const fnName = `${this.clName}.runForSymbolAndWindowType()`

    // Validate
    if (symbol == null) {
      throw new CustomError(`${fnName}: symbol == null`)
    }

    if (windowType == null) {
      throw new CustomError(`${fnName}: windowType == null`)
    }

    // Get the Instrument
    const instrument = await
            instrumentModel.getByUniqueKey(
              prisma,
              exchangeId,
              symbol)

    // Validate
    if (instrument == null) {
      throw new CustomError(`${fnName}: instrument == null`)
    }

    // Get the LLM
    const tech = await
            getTechService.getStandardLlmTech(
              prisma,
              userProfileId)

    // Get the AgentUser
    const agentUser = await
            agentUserModel.getByUniqueRefId(
              prisma,
              BaseDataTypes.batchAgentRefId)

    // Validate
    if (agentUser == null) {
      throw new CustomError(`${fnName}: agentUser == null`)
    }

    // Already done?
    const docWindowInsight = await
            docWindowInsightModel.getByUniqueKey(
              prisma,
              windowType.id,
              instrument.id,
              agentUser.id)

    if (docWindowInsight != null) {
      return
    }

    // Get documents
    const fromDate =
            windowTypesService.getHistoricalDate(windowType)

    const documents = await
            documentModel.filter(
              prisma,
              undefined,  // docSourceId
              fromDate)

    // Validate
    if (documents.length === 0) {
      return
    }

    // Debug
    // console.log(`${fnName}: tech: ` + JSON.stringify(tech))

    // Define the prompt
    var prompt =
          `# General instructions\n` +
          `- Generate a trading news insight based on the news articles.\n` +
          `\n`

    // Define the output
    prompt +=
      `# Results\n` +
      `- The results must be in a map.\n` +
      `- advisedTradeType has values: B (buy), S (sell), H (hold).\n` +
      `- sentimentScore is from -1 to 1.\n` +
      `- confidenceScore is from 0 to 1.\n` +
      `- potencyScore is from 0 to 1.\n` +
      `- noveltyScore is from 0 to 1.\n` +
      `- urgencyScore is from 0 to 1.\n` +
      `\n` +
      `The results should follow this JSON example:\n` +
      `\n` +
      `{\n` +
      `  "advisedTradeType": "B"\n` +
      `  "sentimentScore": 0.0,\n` +
      `  "confidenceScore": 0.0,\n` +
      `  "potencyScore": 0.0,\n` +
      `  "noveltyScore": 0.0,\n` +
      `  "urgencyScore": 0.0\n` +
      `}\n` +
      `\n`

    // Add documents
    prompt +=
      `## News articles\n` +
      `\n` +
      `These are articles from ${fromDate} until today.\n` +
      `\n` +
      JSON.stringify(documents)

    // Debug
    // console.log(`${fnName}: prompt: ${prompt}`)

    // LLM request
    const queryResults = await
            agentLlmService.agentSingleShotLlmRequest(
              prisma,
              tech,
              userProfileId,
              null,       // instanceId
              ServerOnlyTypes.defaultChatSettingsName,
              BaseDataTypes.batchAgentRefId,
              BaseDataTypes.batchAgentName,
              BaseDataTypes.batchAgentRole,
              prompt,
              true)       // isJsonMode

    // Validate
    if (queryResults == null) {

      console.log(`${fnName}: queryResults == null`)
      return
    }

    // Process
    const results = await
            this.processQueryResults(
              prisma,
              windowType.id,
              instrument.id,
              agentUser.id,
              queryResults)
  }
}
