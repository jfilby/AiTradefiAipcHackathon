// Note: this class sets up slideshow data directly using model classes. This
// is for testing purposes, the slideshow data is usually created by generating
// data with AI models.

import { Analysis, PrismaClient, Slideshow, TradeAnalysis } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { ServerOnlyTypes, SlideTypes } from '@/types/server-only-types'
import { ServerTestTypes } from '@/types/server-test-types'
import { AnalysisModel } from '@/models/trade-analysis/analysis-model'
import { GenerationsSettingsModel } from '@/models/trade-analysis/generations-settings-model'
import { InstrumentModel } from '@/models/instruments/instrument-model'
import { SlideshowModel } from '@/models/slideshows/slideshow-model'
import { TradeAnalysesGroupModel } from '@/models/trade-analysis/trade-analyses-group-model'
import { TradeAnalysisModel } from '@/models/trade-analysis/trade-analysis-model'
import { SlideTemplateModel } from '@/models/slideshows/slide-template-model'

// Models
const analysisModel = new AnalysisModel()
const generationsSettingsModel = new GenerationsSettingsModel()
const instrumentModel = new InstrumentModel()
const slideshowModel = new SlideshowModel()
const slideTemplateModel = new SlideTemplateModel()
const tradeAnalysesGroupModel = new TradeAnalysesGroupModel()
const tradeAnalysisModel = new TradeAnalysisModel()

// Class
export class TestDataSetupService {

  // Consts
  clName = 'TestDataSetupService'

  // Code
  async run(prisma: PrismaClient,
            adminUserProfileId: string) {

    // Setup the Analysis
    const analysis = await
            this.setupAnalysis(
              prisma,
              adminUserProfileId)

    // Setup the TradeAnalysis
    const tradeAnalysis = await
            this.setupTradeAnalysis(
              prisma,
              adminUserProfileId,
              analysis)

    // Setup Slideshow
    const slideshow = await
            this.setupSlideshow(
              prisma,
              adminUserProfileId,
              tradeAnalysis)

    // Setup SlideTemplates
    await this.setupSlideTemplates(
            prisma,
            analysis,
            slideshow)

    // Setup Slides
    await this.setupSlides(
            prisma,
            slideshow)
  }

  async setupAnalysis(
          prisma: PrismaClient,
          adminUserProfileId: string) {

    // Debug
    const fnName = `${this.clName}.setupAnalysis()`

    // Get defautl GenerationsSettings
    const generationsSettings = await
            generationsSettingsModel.getByUniqueKey(
              prisma,
              adminUserProfileId,
              ServerOnlyTypes.defaultGenerationsSettingsName)

    if (generationsSettings == null) {
      throw new CustomError(`${fnName}: generationsSettings == null`)
    }

    // Upsert Analysis
    const analysis = await
            analysisModel.upsert(
              prisma,
              undefined,  // id
              adminUserProfileId,
              generationsSettings.id,
              BaseDataTypes.screenerType,
              BaseDataTypes.activeStatus,
              BaseDataTypes.stocksType,
              0.75,       // defaultMinScore
              `Test screener`,
              `1.0.0`,    // version
              `Large caps with upside`,  // description
              `Look for large cap stocks that could still have considerable ` +
              `upside`)   // prompt

    // Return
    return analysis
  }

  async setupSlideshow(
          prisma: PrismaClient,
          adminUserProfileId: string,
          tradeAnalysis: TradeAnalysis) {

    // Upsert the test slideshow
    const slideshow = await
            slideshowModel.upsert(
              prisma,
              undefined,  // id
              tradeAnalysis.id,
              BaseDataTypes.activeStatus)

    // Return
    return slideshow
  }

  async setupSlides(
          prisma: PrismaClient,
          slideshow: Slideshow) {

    ;
  }

  async setupSlideTemplates(
          prisma: PrismaClient,
          analysis: Analysis,
          slideshow: Slideshow) {

    // Create an intro slide template
    const introSlideTemplate = await
            slideTemplateModel.upsert(
              prisma,
              undefined,  // id
              analysis.id,
              1,          // slideNo
              SlideTypes.intro,
              `Invest in NVDA!`,
              `An introduction to the potential investment in NVDA`,
              `Narrate the intro`,
              `An image of NVDA with dollar signs`)

    // Create a requirements slide template
    const requirementsSlideTemplate = await
            slideTemplateModel.upsert(
              prisma,
              undefined,  // id
              analysis.id,
              2,          // slideNo
              SlideTypes.requirements,
              `What we're looking for`,
              `Large caps that have a strong possible upside`,
              `Narrate the text, whispering "upside".`,
              undefined)  // imagePath

    // Create a financials slide template
    const annualFinancialsSlideTemplate = await
            slideTemplateModel.upsert(
              prisma,
              undefined,  // id
              analysis.id,
              3,          // slideNo
              SlideTypes.annualFinancials,
              `Annual financials`,
              `The last few years`,
              `Narrate a summary of the annual financials`,
              undefined)  // imagePath

    // Create a daily chart slide template
    const dailyChartSlideTemplate = await
            slideTemplateModel.upsert(
              prisma,
              undefined,  // id
              analysis.id,
              4,          // slideNo
              SlideTypes.dailyChart,
              `Daily chart`,
              `Stock performance (daily timeframe)`,
              `Narrate a summary of the daily chart`,
              undefined)  // imagePath

    // Create an outro slide template
    const outroChartSlideTemplate = await
            slideTemplateModel.upsert(
              prisma,
              undefined,  // id
              analysis.id,
              5,          // slideNo
              SlideTypes.outro,
              `Summary`,
              `A solid investment decision`,
              `Narrate a brief summary of the investment potential`,
              undefined)  // imagePath
  }

  async setupTradeAnalysis(
          prisma: PrismaClient,
          adminUserProfileId: string,
          analysis: Analysis) {

    // Debug
    const fnName = `${this.clName}.setupTradeAnalysis()`

    // Get current date
    const today = new Date()

    // Upsert TradeAnalysesGroup
    const tradeAnalysesGroup = await
            tradeAnalysesGroupModel.upsert(
              prisma,
              undefined,  // id
              analysis.id,
              today,
              ServerOnlyTypes.tradeAnalysisEngineVersion,
              BaseDataTypes.activeStatus,
              analysis.defaultMinScore,  // minScore
              1)                         // screenerRuns

    // Get Instrument
    const instrument = await
            instrumentModel.getByUniqueKey(
              prisma,
              ServerOnlyTypes.nasdaqExchangeName,
              ServerTestTypes.nvdaSymbol)

    if (instrument == null) {
      throw new CustomError(`${fnName}: instrument == null`)
    }

    // Upsert TradeAnalysis
    const tradeAnalysis = await
            tradeAnalysisModel.upsert(
              prisma,
              undefined,  // id
              tradeAnalysesGroup.id,
              instrument.id,
              undefined,  // techId
              BaseDataTypes.activeStatus,
              ServerOnlyTypes.buyTradeType,
              0.85,       // score,
              `NVDA is a large cap that could still continue upward`)
                // thesis

    // Return
    return tradeAnalysis
  }
}
