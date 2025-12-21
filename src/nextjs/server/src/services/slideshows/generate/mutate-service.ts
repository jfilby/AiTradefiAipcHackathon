import { GenerationsSettings, PrismaClient, Slide, SlideTemplate, TradeAnalysis } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { ServerOnlyTypes } from '@/types/server-only-types'
import { SlideModel } from '@/models/slideshows/slide-model'
import { SlideshowModel } from '@/models/slideshows/slideshow-model'
import { SlideTemplateModel } from '@/models/slideshows/slide-template-model'
import { GenerationsSettingsModel } from '@/models/trade-analysis/generations-settings-model'
import { TradeAnalysisModel } from '@/models/trade-analysis/trade-analysis-model'
import { GenSlideAudioService } from './gen-audio-service'
import { GenSlideImageService } from './gen-image-service'
import { GenSlideTextService } from './gen-text-service'

// Models
const generationsSettingsModel = new GenerationsSettingsModel()
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
  async createSlides(
          prisma: PrismaClient,
          tradeAnalysis: TradeAnalysis) {

    // Get Analysis record
    const analysis = (tradeAnalysis as any).tradeAnalysesGroup.analysis

    // Get GenerationsSettings
    const generationsSettings = await
            generationsSettingsModel.getByUniqueKey(
              prisma,
              analysis.userProfileId,
              ServerOnlyTypes.defaultGenerationsSettingsName)

    // Try to get an existing record
    var slideshow = await
          slideshowModel.getByUniqueKey(
            prisma,
            tradeAnalysis.id)

    if (slideshow != null) {
      return
    }

    // Create a new record
    slideshow = await
      slideshowModel.create(
        prisma,
        analysis.userProfileId,
        tradeAnalysis.id,
        BaseDataTypes.newStatus)

    // Get SlideTemplates
    const slideTemplates = await
            slideTemplateModel.filter(
              prisma,
              analysis.id,
              undefined,  // slideNo
              undefined,  // type
              true)       // sortBySlideNo

    // Generate the text for all slides
    await genSlideTextService.generate(
            prisma,
            slideshow.id,
            tradeAnalysis,
            slideTemplates)

    // Create all slides
    for (const slideTemplate of slideTemplates) {

      // Try to get an existing slide
      var slide = await
            slideModel.getByUniqueKey1(
              prisma,
              slideshow.id,
              slideTemplate.id)

      // Skip ahead if slide already active
      if (slide?.status === BaseDataTypes.activeStatus) {
        continue
      }

      // Update the new slide
      slide = await
        this.updateSlide(
          prisma,
          generationsSettings,
          slide,
          slideTemplate)
    }

    // Set slideshow to active status
    slideshow = await
      slideshowModel.update(
        prisma,
        slideshow.id,
        undefined,  // userProfileId
        undefined,  // tradeAnalysisId
        BaseDataTypes.activeStatus)
  }

  async run(prisma: PrismaClient) {

    // Debug
    const fnName = `${this.clName}.run()`

    // Debug
    console.log(`${fnName}: starting..`)

    // Get TradeAnalysis records without completed slideshows
    const tradeAnalyses = await
            tradeAnalysisModel.filterWithoutActiveSlideshows(prisma)

    // Update/finish slideshows for TradeAnalyses
    for (const tradeAnalysis of tradeAnalyses) {

      await this.createSlides(
              prisma,
              tradeAnalysis)
    }

    // Debug
    console.log(`${fnName}: completed`)
  }

  async updateSlide(
          prisma: PrismaClient,
          generationsSettings: GenerationsSettings,
          slide: Slide,
          slideTemplate: SlideTemplate) {

    // Debug
    const fnName = `${this.clName}.updateSlide()`

    // Narrate audio
    var narrateAudio = false

    if (generationsSettings?.slideshowSettings != null &&
        (generationsSettings.slideshowSettings as any).withAudioNarration === true) {

      narrateAudio = true
    }

    // Generate audio
    var generatedAudioId: string | undefined = undefined

    if (narrateAudio === true) {

      generatedAudioId = await
        genSlideAudioService.generate(
          prisma,
          slide)
    }

    // Generate image
    const generatedImageId = await
            genSlideImageService.generate(
              prisma,
              slideTemplate)

    // Update Slide to active
    slide = await
      slideModel.update(
        prisma,
        slide.id,
        undefined,  // slideshowId
        undefined,  // slideTemplateId
        undefined,  // slideNo
        BaseDataTypes.activeStatus,
        undefined,  // slideTemplate.title
        undefined,  // text
        undefined,  // narratedText
        generatedAudioId,
        generatedImageId)
  }
}
