import { PrismaClient } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { SlideTypes } from '@/types/server-only-types'
import { YFinanceFinTypes, yFinanceIntervals } from '@/types/yfinance-types'
import { InstrumentModel } from '@/models/instruments/instrument-model'
import { SlideshowModel } from '@/models/slideshows/slideshow-model'
import { YFinanceChartModel } from '@/models/yfinance-models/yfinance-chart-model'
import { YFinanceFinModel } from '@/models/yfinance-models/yfinance-fin-model'
import { YFinanceQuoteModel } from '@/models/yfinance-models/yfinance-quote-model'
import { CurrencyUtilsService } from '@/services/utils/currency-service'
import { YFinanceToChartjsService } from '@/services/external-data/yfinance/to-chartjs-service'

// Models
const instrumentModel = new InstrumentModel()
const slideshowModel = new SlideshowModel()
const yFinanceFinModel = new YFinanceFinModel()
const yFinanceChartModel = new YFinanceChartModel
const yFinanceQuoteModel = new YFinanceQuoteModel()

// Services
const currencyUtilsService = new CurrencyUtilsService()
const yFinanceToChartjsService = new YFinanceToChartjsService()

// Class
export class SlideshowsQueryService {

  // Consts
  clName = 'SlideshowsQueryService'

  // Code
  async enrichSlideshow(
          prisma: PrismaClient,
          slideshow: any) {

    // Debug
    const fnName = `${this.clName}.enrichSlideshow()`

    // console.log(`${fnName}: slideshow.tradeAnalysis.instrumentId: ` +
    //             JSON.stringify(slideshow.tradeAnalysis.instrumentId))

    // Get instrument with exchange
    const instrument = await
            instrumentModel.getById(
              prisma,
              slideshow.tradeAnalysis.instrumentId,
              true)  // includeExchange

    const exchangeCurrencySymbol =
            currencyUtilsService.getCurrencySymbol(instrument.exchange.currencyCode)

    // Get financials currency from Y!Finance quote data
    const yFinanceQuote = await
            yFinanceQuoteModel.getByUniqueKey(
              prisma,
              slideshow.tradeAnalysis.instrumentId)

    if (yFinanceQuote == null) {
      throw new CustomError(
        `${fnName}: yFinanceQuote == null for instrumentId: ` +
        `${slideshow.tradeAnalysis.instrumentId}`)
    }

    const financialsCurrencySymbol =
            currencyUtilsService.getCurrencySymbol(yFinanceQuote.data.currency)

    // Get Y!Finance data
    const yFinanceAnnualFinancials = await
            yFinanceFinModel.getLatest(
              prisma,
              slideshow.tradeAnalysis.instrumentId,
              YFinanceFinTypes.annual,
              3)  // limitBy

    const yFinanceQuarterlyFinancials = await
            yFinanceFinModel.getLatest(
              prisma,
              slideshow.tradeAnalysis.instrumentId,
              YFinanceFinTypes.quarterly,
              3)  // limitBy

    const yFinanceDailyChart = await
            yFinanceChartModel.getLatest(
              prisma,
              slideshow.tradeAnalysis.instrumentId,
              yFinanceIntervals.daily,
              365)  // limitBy

    // Enrich specific slide types
    for (const slide of slideshow.slides) {

      // Debug
      // console.log(`${fnName}: slide.slideTemplate: ` +
      //             JSON.stringify(slide.slideTemplate))

      // Enrich slides of specific types
      switch (slide.slideTemplate.type) {

        case SlideTypes.annualFinancials: {
          slide.annualFinancials =
            yFinanceToChartjsService.fromAnnualFinancials(
              yFinanceAnnualFinancials,
              financialsCurrencySymbol)

          break
        }

        case SlideTypes.quarterlyFinancials: {
          slide.quarterlyFinancials =
            yFinanceToChartjsService.fromQuarterlyFinancials(
              yFinanceQuarterlyFinancials,
              financialsCurrencySymbol)

          break
        }

        case SlideTypes.dailyChart: {
          slide.dailyChart =
            yFinanceToChartjsService.fromDailyChart(
              yFinanceDailyChart,
              exchangeCurrencySymbol)

          break
        }
      }

      // Debug
      // console.log(`${fnName}: slide: ` + JSON.stringify(slide))
    }
  }

  async getById(
          prisma: PrismaClient,
          userProfileId: string,
          slideshowId: string) {

    // Query
    const slideshow = await
            slideshowModel.getById(
              prisma,
              slideshowId,
              true,  // includeSlides
              true)  // includeTradeAnalysis

    // Adjust slides name
    slideshow.slides = slideshow.ofSlides

    // Enrich with data
    await this.enrichSlideshow(
            prisma,
            slideshow)

    // Adjust new-lines (double single new-lines)
    for (const slide of slideshow.slides) {

      if (slide.text != null) {
        slide.text = slide.text.replace(/(?<!\n)\n(?!\n)/g, '\n\n')
      }
    }

    // Return
    return {
      status: true,
      slideshow: slideshow
    }
  }

  async getLatest(
          prisma: PrismaClient,
          userProfileId: string | undefined,
          analysisId: string | undefined) {

    // Debug
    const fnName = `${this.clName}.getLatest()`

    // Query the latst Slideshows with their Slide records
    const slideshows = await
            slideshowModel.getByLatest(
              prisma,
              userProfileId,
              analysisId)

    // Debug
    // console.log(`${fnName}: slideshows: ` + JSON.stringify(slideshows))

    // Adjust slides name
    for (const slideshow of slideshows) {

      (slideshow as any).slides = slideshow.ofSlides
    }

    // Return
    return {
      status: true,
      slideshows: slideshows
    }
  }
}
