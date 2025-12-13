// Note: this class sets up slideshow data directly using model classes. This
// is for testing purposes, the slideshow data is usually created by generating
// data with AI models.

import { Analysis, PrismaClient, Slideshow, TradeAnalysis } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { ServerOnlyTypes, SlideTypes } from '@/types/server-only-types'
import { ServerTestTypes } from '@/types/server-test-types'
import { AnalysisModel } from '@/models/trade-analysis/analysis-model'
import { ExchangeModel } from '@/models/instruments/exchange-model'
import { GenerationsSettingsModel } from '@/models/trade-analysis/generations-settings-model'
import { InstrumentModel } from '@/models/instruments/instrument-model'
import { SlideshowModel } from '@/models/slideshows/slideshow-model'
import { SlideModel } from '@/models/slideshows/slide-model'
import { SlideTemplateModel } from '@/models/slideshows/slide-template-model'
import { TradeAnalysesGroupModel } from '@/models/trade-analysis/trade-analyses-group-model'
import { TradeAnalysisModel } from '@/models/trade-analysis/trade-analysis-model'
import { GeneratedAudioModel } from '@/models/generated-media/generated-audio-model'
import { GeneratedImageModel } from '@/models/generated-media/generated-image-model'
import { GetTechService } from '../tech/get-tech-service'

// Models
const analysisModel = new AnalysisModel()
const exchangeModel = new ExchangeModel()
const generatedAudioModel = new GeneratedAudioModel()
const generatedImageModel = new GeneratedImageModel()
const generationsSettingsModel = new GenerationsSettingsModel()
const instrumentModel = new InstrumentModel()
const slideshowModel = new SlideshowModel()
const slideModel = new SlideModel()
const slideTemplateModel = new SlideTemplateModel()
const tradeAnalysesGroupModel = new TradeAnalysesGroupModel()
const tradeAnalysisModel = new TradeAnalysisModel()

// Services
const getTechService = new GetTechService()

// Class
export class AnalysisToSlidesTestDataService {

  // Consts
  clName = 'AnalysisToSlidesTestDataService'

  // Code
  async run(prisma: PrismaClient,
            adminUserProfileId: string) {

    // Setup media
    await this.setupMedia(prisma)

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
            analysis,
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

  async setupMedia(prisma: PrismaClient) {

    ;
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
          analysis: Analysis,
          slideshow: Slideshow) {

    // Get the SlideTemplates (in order)
    const slideTemplates = await
            slideTemplateModel.filter(
              prisma,
              analysis.id,
              undefined,  // slideNo
              undefined,  // type
              true)       // sortBySlideNo

    // Get the audioPath for slideNo 1
    const generatedAudio = await
            generatedAudioModel.getByUniqueKey(
              prisma,
              `/audio/nvda-test/overview.mp3`)

    // Get the imagePath for slideNo 1
    ;

    // Create the intro slide
    const introSlide = await
            slideModel.upsert(
              prisma,
              undefined,  // id
              slideshow.id,
              slideTemplates[0].id,
              slideTemplates[0].slideNo,
              BaseDataTypes.activeStatus,
              slideTemplates[0].title,
              slideTemplates[0].textPrompt,
              generatedAudio.id,
              null)       // imagePath
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
              null)       // imagePath

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
              null)       // imagePath

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
              null)       // imagePath

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
              null)       // imagePath
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

    // Setup Instrument
    const instrument = await
            this.setupInstrument(prisma)

    // Get tech
    const tech = await
            getTechService.getStandardLlmTech(prisma)

    // Upsert TradeAnalysis
    const tradeAnalysis = await
            tradeAnalysisModel.upsert(
              prisma,
              undefined,  // id
              tradeAnalysesGroup.id,
              instrument.id,
              tech.id,
              BaseDataTypes.activeStatus,
              ServerOnlyTypes.buyTradeType,
              0.85,       // score,
              `NVDA is a large cap that could still continue upward`)
                // thesis

    // Return
    return tradeAnalysis
  }

  async setupInstrument(prisma: PrismaClient) {

    // Debug
    const fnName = `${this.clName}.setupInstrument`

    // Get exchange
    const exchange = await
            exchangeModel.getByUniqueKey(
              prisma,
              ServerOnlyTypes.nasdaqExchangeName)

    if (exchange == null) {
      throw new CustomError(`${fnName}: exchange == null`)
    }

    // Get Instrument
    const symbol = ServerTestTypes.nvdaSymbol

    const instrument = await
            instrumentModel.upsert(
              prisma,
              undefined,  // id
              exchange.id,
              BaseDataTypes.activeStatus,
              symbol,
              BaseDataTypes.stocksType,
              'Nvidia',
              null)       // yahooFinanceTicker

    // Return
    return instrument
  }
}
