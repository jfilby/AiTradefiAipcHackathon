import { PrismaClient, SlideTemplate } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { SlideModel } from '@/models/slideshows/slide-model'
import { SlideshowModel } from '@/models/slideshows/slideshow-model'
import { SlideTemplateModel } from '@/models/slideshows/slide-template-model'
import { TradeAnalysisModel } from '@/models/trade-analysis/trade-analysis-model'

// Models
const slideModel = new SlideModel()
const slideshowModel = new SlideshowModel()
const slideTemplateModel = new SlideTemplateModel()
const tradeAnalysisModel = new TradeAnalysisModel()

// Class
export class SlideshowMutateService {

  // Consts
  clName = 'SlideshowMutateService'

  // Code
  async createSlide(
          prisma: PrismaClient,
          slideshowId: string,
          slideTemplate: SlideTemplate,
          index: number) {

    // Debug
    const fnName = `${this.clName}.createSlide()`

    // Create new Slide
    var slide = await
          slideModel.create(
            prisma,
            slideshowId,
            slideTemplate.id,
            index,
            BaseDataTypes.newStatus,
            slideTemplate.title,
            null,         // text
            null,         // audioPath
            null)         // imagePath

    // Generate text
    ;

    // Generate audio
    ;

    // Generate image
    ;

    // Update Slide to active
    ;
  }

  async getOrCreate(
          prisma: PrismaClient,
          tradeAnalysisId: string) {

    // Get TradeAnalysis
    const tradeAnalysis = await
            tradeAnalysisModel.getById(
              prisma,
              tradeAnalysisId,
              true)  // includeAnalysis

    // Try to get an existing record
    var slideshow = await
          slideshowModel.getByUniqueKey(
            prisma,
            tradeAnalysisId)

    if (slideshow != null) {
      return
    }

    // Create a new record
    slideshow = await
      slideshowModel.create(
        prisma,
        tradeAnalysisId,
        BaseDataTypes.newStatus)

    // Get SlideTemplates
    const slideTemplates = await
            slideTemplateModel.filter(
              prisma,
              tradeAnalysis.tradeAnalysesGroup.analysisId,
              undefined,  // slideNo
              undefined,  // type
              true)       // sortBySlideNo

    // Create all slides
    var index = 0

    for (const slideTemplate of slideTemplates) {

      const slide = await
              this.createSlide(
                prisma,
                slideshow.id,
                slideTemplate,
                index)

      index += 1
    }
  }
}
