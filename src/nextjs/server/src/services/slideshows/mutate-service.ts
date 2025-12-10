import { PrismaClient, Slide, SlideTemplate } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { SlideModel } from '@/models/slideshows/slide-model'
import { SlideshowModel } from '@/models/slideshows/slideshow-model'
import { SlideTemplateModel } from '@/models/slideshows/slide-template-model'
import { TradeAnalysisModel } from '@/models/trade-analysis/trade-analysis-model'
import { GenSlideAudioService } from './gen-audio-service'
import { GenSlideImageService } from './gen-image-service'
import { GenSlideTextService } from './gen-text-service'

// Models
const slideModel = new SlideModel()
const slideshowModel = new SlideshowModel()
const slideTemplateModel = new SlideTemplateModel()
const tradeAnalysisModel = new TradeAnalysisModel()

// Services
const genSlideAudioService = new GenSlideAudioService()
const genSlideImageService = new GenSlideImageService()
const genSlideTextService = new GenSlideTextService()

// Class
export class SlideshowMutateService {

  // Consts
  clName = 'SlideshowMutateService'

  // Code
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

    // Generate the text for all slides
    await genSlideTextService.generate(
            prisma,
            slideshow.id,
            slideTemplates)

    // Create all slides
    var index = 0

    for (const slideTemplate of slideTemplates) {

      // Try to get an existing slide
      var slide = await
            slideModel.getByUniqueKey2(
              prisma,
              slideshow,
              index)

      // Skip ahead if slide already active
      if (slide?.status === BaseDataTypes.activeStatus) {
        continue
      }

      // Create a new slide
      slide = await
        this.upsertSlide(
          prisma,
          slideshow.id,
          slide,
          slideTemplate,
          index)

      index += 1
    }
  }

  async upsertSlide(
          prisma: PrismaClient,
          slideshowId: string,
          slide: Slide | undefined,
          slideTemplate: SlideTemplate,
          index: number) {

    // Debug
    const fnName = `${this.clName}.upsertSlide()`

    // Upsert new Slide (with new status)
    slide = await
      slideModel.upsert(
        prisma,
        slide?.id,
        slideshowId,
        slideTemplate.id,
        index,
        BaseDataTypes.newStatus,
        slideTemplate.title,
        null,         // text
        null,         // audioPath
        null)         // imagePath

    // Generate audio
    const audioPath = await
            genSlideAudioService.generate(
              prisma,
              slideTemplate)

    // Generate image
    const imagePath = await
            genSlideImageService.generate(
              prisma,
              slideTemplate)

    // Update Slide to active
    slide = await
      slideModel.update(
        prisma,
        slide.id,
        slideshowId,
        slideTemplate.id,
        index,
        BaseDataTypes.activeStatus,
        slideTemplate.title,
        undefined,  // text
        audioPath,
        imagePath)
  }
}
