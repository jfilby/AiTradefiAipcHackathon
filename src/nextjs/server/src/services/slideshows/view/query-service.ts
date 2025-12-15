import { PrismaClient } from '@prisma/client'
import { SlideTypes } from '@/types/server-only-types'
import { YFinanceFinTypes, yFinanceIntervals } from '@/types/yfinance-types'
import { SlideshowModel } from '@/models/slideshows/slideshow-model'
import { YFinanceChartModel } from '@/models/yfinance-models/yfinance-chart-model'
import { YFinanceFinModel } from '@/models/yfinance-models/yfinance-fin-model'
import { YFinanceToChartjsService } from '@/services/external-data/yfinance/to-chartjs-service'

// Models
const slideshowModel = new SlideshowModel()
const yFinanceFinModel = new YFinanceFinModel()
const yFinanceChartModel = new YFinanceChartModel

// Services
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

    console.log(`${fnName}: slideshow.tradeAnalysis.instrumentId: ` +
                JSON.stringify(slideshow.tradeAnalysis.instrumentId))

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
            yFinanceToChartjsService.fromAnnualFinancials(yFinanceAnnualFinancials)

          break
        }

        case SlideTypes.quarterlyFinancials: {
          slide.quarterlyFinancials =
            yFinanceToChartjsService.fromQuarterlyFinancials(yFinanceQuarterlyFinancials)

          break
        }

        case SlideTypes.dailyChart: {
          slide.dailyChart =
            yFinanceToChartjsService.fromDailyChart(yFinanceDailyChart)
          break
        }
      }

      // Debug
      console.log(`${fnName}: slide: ` + JSON.stringify(slide))
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
