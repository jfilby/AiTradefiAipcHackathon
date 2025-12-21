import { Analysis, Exchange, PrismaClient, Tech, TradeAnalysesGroup } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { TechModel } from '@/serene-core-server/models/tech/tech-model'
import { UsersService } from '@/serene-core-server/services/users/service'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { ServerOnlyTypes } from '@/types/server-only-types'
import { ServerTestTypes } from '@/types/server-test-types'
import { InstrumentContextMap, YFinanceInstrumentContext } from '../../types/yfinance-types'
import { AnalysisModel } from '@/models/trade-analysis/analysis-model'
import { AnalysisTechModel } from '@/models/trade-analysis/analysis-tech-model'
import { ExchangeModel } from '@/models/instruments/exchange-model'
import { InstrumentModel } from '@/models/instruments/instrument-model'
import { TradeAnalysesGroupModel } from '@/models/trade-analysis/trade-analyses-group-model'
import { TradeAnalysisModel } from '@/models/trade-analysis/trade-analysis-model'
import { SetupAnalysesTechService } from '../analysis/setup-tech-service'
import { TradeAnalysisLlmService } from './llm-service'
import { TradeAnalysisQueryService } from './query-service'
import { YFinanceMutateService } from '../external-data/yfinance/mutate-service'
import { YFinanceQueryService } from '../external-data/yfinance/query-service'

// Models
const analysisModel = new AnalysisModel()
const analysisTechModel = new AnalysisTechModel()
const exchangeModel = new ExchangeModel()
const instrumentModel = new InstrumentModel()
const techModel = new TechModel()
const tradeAnalysesGroupModel = new TradeAnalysesGroupModel()
const tradeAnalysisModel = new TradeAnalysisModel()

// Services
const setupAnalysesTechService = new SetupAnalysesTechService()
const tradeAnalysisLlmService = new TradeAnalysisLlmService()
const tradeAnalysisQueryService = new TradeAnalysisQueryService()
const usersService = new UsersService()
const yFinanceMutateService = new YFinanceMutateService()
const yFinanceQueryService = new YFinanceQueryService()

// Class
export class TradeAnalysisMutateService {

  // Consts
  clName = 'TradeAnalysisMutateService'

  // Code
  getPrompt(
    pass: number,
    tradeAnalysesGroup: TradeAnalysesGroup,
    type: string,
    analysisPrompt: string,
    exchangeNames: string[],
    instrumentContextMap: InstrumentContextMap,
    instrumentNamesAlreadyKnown: string[]) {

    // Debug
    const fnName = `${this.clName}.getPrompt()`

    // Validate
    if (pass === 2 &&
        instrumentContextMap.size === 0) {

      throw new CustomError(`${fnName}: pass 2 expects instruments as input`)
    }

    // Determine the number of instruments to generate
    var instrumentsToGenerate = ServerOnlyTypes.instrumentsPerScreenerRun

    if (pass === 1) {
      // Pass 1 needs to generate more than expected as several of them will
      // likely be screened out by pass 2.
      instrumentsToGenerate =
        instrumentsToGenerate * ServerOnlyTypes.instrumentsPass1Factor
    }

    // Start the prompt
    var prompt =
          `## Instructions\n` +
          `- Generate analysis results, in JSON, for ` +
          `${ServerOnlyTypes.instrumentsPerScreenerRun} instruments of type ` +
          `  ${type} as shown in the example section.\n` +
          `- The instruments in your output must be currently listed on ` +
          `  their exchange. Don't create fictional symbols.\n` +
          `- The "Analysis thesis" section specifies the requirements per ` +
          `  instrument.\n` +
          `- Note that today is: ${tradeAnalysesGroup.day.toISOString()}\n`

    // No thesis until pass 2
    if (pass === 2) {

      prompt +=
        `- Don't refer to the given analysis thesis or its requirements ` +
        `  when writing your theses.\n`
    }

    // Continue prompt
    prompt +=
      `\n` +
      `## Analysis thesis\n` +
      `${analysisPrompt}\n` +
      `\n` +
      `## Exchanges\n` +
      `Only include for exchanges: ` +
      exchangeNames.join(', ') + `\n` +
      `\n`

    // Include known instruments and their contexts
    if (instrumentContextMap.size > 0) {

      prompt +=
        `## Instruments\n` +
        `Your output must only be for the instruments in this section.\n` +
        `\n`

      for (const instrument of instrumentContextMap.keys()) {

        const context = instrumentContextMap.get(instrument)

        if (context == null) {
          throw new CustomError(`${fnName}: context == null for instrument: ` +
                                `${instrument}`)
        }

        prompt +=
          `### ${instrument}\n` +
          `\n` +
          `#### Quote\n` +
          JSON.stringify(context.yFinanceQuote) +
          `\n` +
          `#### Financials\n` +
          JSON.stringify(context.yFinanceFinancials) +
          `\n`
      }
    }

    // Continue the prompt
    prompt +=
      `## Don't include\n` +
      `Don't include any analysis for these instruments: ` +
      instrumentNamesAlreadyKnown.join(', ') + `\n` +
      `\n` +
      `## Fields\n` +
      `Take note of these fields in the output:\n` +
      `- tradeType: a B (buy) or S (sell) based on the thesis\n`

    if (pass === 2) {

      prompt +=
        `- score: the score from 0..1 by the analysis thesis\n`
    }

    // Continue the prompt
    prompt +=
      `\n` +
      `## Example\n` +
      `{\n` +
      `  "exchange": "NASDAQ",\n` +
      `  "instrument": "NVDA",\n` +
      `  "tradeType": "B"\n`

    // Only include the thesis field in pass 2
    if (pass === 2) {

      prompt +=
        `,\n` +
        `  "score": 0.85\n` +
        `  "thesis": "Consistent sales increases.."\n`
    } else {
      prompt += `\n`
    }

    // End of example
    prompt +=
      `}\n`

    return prompt
  }

  async processQueryResultsPass1(
          prisma: PrismaClient,
          instrumentType: string,
          queryResults: any): Promise<InstrumentContextMap> {

    // Debug
    const fnName = `${this.clName}.processQueryResultsPass1()`

    // Process entries
    const instrumentsMap = new Map<string, YFinanceInstrumentContext | undefined>()

    for (const entry of queryResults.json) {

      // Get Exchange
      const exchange = await
              exchangeModel.getByUniqueKey(
                prisma,
                entry.exchange)

      if (exchange == null) {
        throw new CustomError(`${fnName}: exchange == null`)
      }

      // Get Instrument
      var instrument = await
            instrumentModel.getByUniqueKey(
              prisma,
              exchange.id,
              entry.instrument)

      if (instrument == null) {

        // Debug
        // console.log(`${fnName}: creating Instrument for exchangeId: ` +
        //             `${exchange.id} symbol: ${entry.instrument}`)

        // Create (but not yet active)
        instrument = await
          instrumentModel.create(
            prisma,
            exchange.id,
            BaseDataTypes.newStatus,
            entry.instrument,
            instrumentType,
            entry.instrument,
            null,       // yahooFinanceTicker
            null)       // lastYFinanceTry
      }

      // Enrich with Y! Finance data
      var yFinanceStatus = false

      try {
        yFinanceStatus = await
          yFinanceMutateService.run(
            prisma,
            exchange,
            instrument)

      } catch(e: any) {
        // Unhandled Y!Finance exception
        console.warn(`${fnName}: unhandled Y! Finance enrichment error`)
        console.error(`${fnName}: error message:`, e?.message)
        console.error(`${fnName}: error stack:`, e?.stack)
        console.error(`${fnName}: raw error:`, e)
        // throw `Failed..`
        continue
      }

      // Not found?
      if (yFinanceStatus === false) {
        
        // Set to inactive
        instrument = await
          instrumentModel.update(
            prisma,
            instrument.id,
            undefined,   // exchangeId,
            BaseDataTypes.inactiveStatus,
            undefined,   // symbol
            undefined,   // type
            undefined,   // name
            undefined,   // yahooFinanceTicker
            new Date())  // lastYFinanceTry

        // Skip to next instrument
        continue
      }

      // Found
      if (instrument.status !== BaseDataTypes.activeStatus) {

        // Set to active
        instrument = await
          instrumentModel.update(
            prisma,
            instrument.id,
            undefined,  // exchangeId,
            BaseDataTypes.activeStatus,
            undefined,  // symbol
            undefined,  // type
            undefined,  // name
            undefined,  // yahooFinanceTicker
            undefined)  // lastYFinanceTry
      }

      // Get context
      const yFinanceInstrumentContext = await
              yFinanceQueryService.getContext(
                prisma,
                instrument.id)

      instrumentsMap.set(
        instrument.id,
        yFinanceInstrumentContext)
    }

    // Return
    return instrumentsMap
  }

  async processQueryResultsPass2(
          prisma: PrismaClient,
          analysis: Analysis,
          tradeAnalysesGroup: TradeAnalysesGroup,
          techId: string,
          instrumentType: string,
          queryResults: any): Promise<InstrumentContextMap> {

    // Process each entry
    var instrumentsMap = new Map<string, YFinanceInstrumentContext | undefined>()

    for (const entry of queryResults.json) {

      // Get Exchange
      const exchange = await
              exchangeModel.getByUniqueKey(
                prisma,
                entry.exchange)

      // Get Instrument
      var instrument = await
            instrumentModel.getByUniqueKey(
              prisma,
              exchange.id,
              entry.instrument)

      // Check if TradeAnalysis already exists
      const tradeAnalysis = await
              tradeAnalysisModel.getByUniqueKey(
                prisma,
                tradeAnalysesGroup.id,
                instrument.id,
                techId)

      if (tradeAnalysis != null) {
        continue
      }

      // Determine getByPassedMinScore
      var passedMinScore = false

      if (entry.score >= analysis.defaultMinScore) {
        passedMinScore = true
      }

      // Create TradeAnalysis
      await tradeAnalysisModel.create(
              prisma,
              tradeAnalysesGroup.id,
              instrument.id,
              techId,
              BaseDataTypes.activeStatus,
              entry.tradeType,
              entry.score,
              passedMinScore,
              entry.thesis)

      // Save instrument name
      instrumentsMap.set(
        entry.instrumentId,
        undefined)
    }

    // Return
    return instrumentsMap
  }

  async run(prisma: PrismaClient) {

    // Debug
    const fnName = `${this.clName}.run()`

    console.log(`${fnName}: starting..`)

    // Get the admin UserProfile
    const adminUserProfile = await
            usersService.getUserProfileByEmail(
              prisma,
              ServerTestTypes.adminUserEmail)

    if (adminUserProfile == null) {
      throw new CustomError(`${fnName}: adminUserProfile == null`)
    }

    // Run each active analysis
    const analyses = await
            analysisModel.filter(
              prisma,
              undefined,  // userProfileId
              undefined,  // generationsSettingsId
              undefined,  // type
              BaseDataTypes.activeStatus)

    for (const analysis of analyses) {

      await this.runAnalysis(
              prisma,
              adminUserProfile.id,
              analysis)
    }

    // Debug
    console.log(`${fnName}: completed`)
  }

  async runAnalysis(
          prisma: PrismaClient,
          adminUserProfileId: string,
          analysis: Analysis) {

    // Debug
    const fnName = `${this.clName}.runAnalysis()`

    // Get leading analysis tech
    var leadingAnalysisTechs = await
          analysisTechModel.filter(
            prisma,
            analysis.id,
            undefined,  // techId
            BaseDataTypes.activeStatus,
            true)       // isLeaderTech

    // Create a leader tech AnalysisTech if non exists
    if (leadingAnalysisTechs.length === 0) {

      leadingAnalysisTechs = await
        setupAnalysesTechService.setupAnalysis(
          prisma,
          analysis,
          true)  // returnLeadingOnly
    }

    // Don't rerun the current group after max screener runs.
    // Don't run another group of an analysis until at least a week.
    const canRun = await
            tradeAnalysisQueryService.canRunTradeAnalysis(
              prisma,
              analysis.id)

    console.log(`${fnName}: canRun: ${canRun}`)

    if (canRun === false) {
      return
    }

    // Get day
    const day = new Date()

    // Try to get TradeAnalysisGroup
    var tradeAnalysesGroup = await
          tradeAnalysesGroupModel.getByUniqueKey(
            prisma,
            analysis.id,
            day)

    // Create TradeAnalysisGroup if needed
    if (tradeAnalysesGroup == null) {

      tradeAnalysesGroup = await
        tradeAnalysesGroupModel.create(
          prisma,
          analysis.userProfileId,
          analysis.id,
          day,
          ServerOnlyTypes.tradeAnalysisEngineVersion,
          BaseDataTypes.newStatus,
          analysis.defaultMinScore,
          0)          // screenerRuns
    }

    // Get tech
    var tech = await
          techModel.getById(
            prisma,
            leadingAnalysisTechs[0].techId)

    // Run the analysis for the leading techId
    var instrumentContextMap =
          new Map<string, YFinanceInstrumentContext | undefined>()

    for (var i = 0; i < 2; i++) {

      instrumentContextMap = await
        this.runTradeAnalysesGroup(
          prisma,
          adminUserProfileId,
          analysis,
          tradeAnalysesGroup,
          tech,
          i + 1,   // pass (starts at 1)
          instrumentContextMap)
    }

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
          nonLeadingAnalysisTech.techId)

      await this.runTradeAnalysesGroup(
              prisma,
              adminUserProfileId,
              analysis,
              tradeAnalysesGroup,
              tech,
              2,  // pass 2
              instrumentContextMap)
    }
  }

  async runTradeAnalysesGroup(
          prisma: PrismaClient,
          adminUserProfileId: string,
          analysis: Analysis,
          tradeAnalysesGroup: TradeAnalysesGroup,
          tech: Tech,
          pass: number,
          instrumentContextMap: InstrumentContextMap): Promise<InstrumentContextMap> {

    // Debug
    const fnName = `${this.clName}.runTradeAnalysesGroup()`

    // Validate
    if (pass < 1 || pass > 2) {
      throw new CustomError(`${fnName}: invalid pass: ${pass}`)
    }

    // Validate
    if (pass === 2 &&
        instrumentContextMap.size === 0) {

      console.warn(`${fnName}: pass 2 requires at least one ` +
                   `instrumentContextMap entry (safely aborting run..)`)

      return new Map<string, YFinanceInstrumentContext | undefined>()
    }

    // Instrument type
    const instrumentType = BaseDataTypes.stocksType

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
    const instrumentsAlreadyKnown = await
            tradeAnalysisModel.filter(
              prisma,
              tradeAnalysesGroup.id,
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,  // passedMinScore
              true)       // includeInstrument

    const instrumentNamesAlreadyKnown =
            instrumentsAlreadyKnown.map(
              (instrumentAlreadyKnown: any) =>
                `${instrumentAlreadyKnown.instrument.name}:` +
                `${instrumentAlreadyKnown.instrument.exchange.name}`)

    // Get the prompt
    const prompt =
            this.getPrompt(
              pass,
              tradeAnalysesGroup,
              analysis.instrumentType,
              analysis.prompt,
              exchangeNames,
              instrumentContextMap,
              instrumentNamesAlreadyKnown)

    // Debug
    // console.log(`${fnName}: prompt: ${prompt}`)

    // LLM request
    const { status, message, queryResults } = await
            tradeAnalysisLlmService.llmRequest(
              prisma,
              adminUserProfileId,
              tech,
              pass,
              prompt)

    // Validate
    if (status === false) {
      throw new CustomError(`${fnName}: message: ${message}`)
    }

    // Debug
    console.log(`${fnName}: queryResults: ` + JSON.stringify(queryResults))

    // Process
    var newInstrumentContextMap: InstrumentContextMap

    if (pass === 1) {

      newInstrumentContextMap = await
        this.processQueryResultsPass1(
          prisma,
          instrumentType,
          queryResults)

    } else if (pass === 2) {

      newInstrumentContextMap = await
        this.processQueryResultsPass2(
          prisma,
          analysis,
          tradeAnalysesGroup,
          tech.id,
          instrumentType,
          queryResults)
    }

    // Update screenerRuns
    tradeAnalysesGroup = await
      tradeAnalysesGroupModel.update(
        prisma,
        tradeAnalysesGroup.id,
        undefined,  // userProfileId
        undefined,  // analysisId
        undefined,  // day
        undefined,  // engineVersion
        BaseDataTypes.activeStatus,  // Set to active status from the first run
        undefined,  // minScore
        tradeAnalysesGroup.screenerRuns + 1)

    // Return
    return newInstrumentContextMap!
  }
}
