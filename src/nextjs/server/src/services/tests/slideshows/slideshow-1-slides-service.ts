import { Analysis, PrismaClient, Slideshow, SlideTemplate } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { NarrationTones } from '@/types/elevenlabs-types'
import { ServerTestTypes } from '@/types/server-test-types'
import { GeneratedAudioModel } from '@/models/generated-media/generated-audio-model'
import { GeneratedImageModel } from '@/models/generated-media/generated-image-model'
import { NarrationModel } from '@/models/slideshows/narration-model'
import { NarrationSegmentModel } from '@/models/slideshows/narration-segment-model'
import { SlideModel } from '@/models/slideshows/slide-model'
import { SlideTemplateModel } from '@/models/slideshows/slide-template-model'

// Models
const generatedAudioModel = new GeneratedAudioModel()
const generatedImageModel = new GeneratedImageModel()
const narrationModel = new NarrationModel()
const narrationSegmentModel = new NarrationSegmentModel()
const slideModel = new SlideModel()
const slideTemplateModel = new SlideTemplateModel()

// Class
export class Slideshow1SlidesService {

  // Consts
  clName = 'Slideshow1SlidesService'

  // Code
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

    // Setup slides
    await this.setupSlide1(
            prisma,
            slideshow,
            slideTemplates[0])

    await this.setupSlide2(
            prisma,
            slideshow,
            slideTemplates[1])

    await this.setupSlide3(
            prisma,
            slideshow,
            slideTemplates[2])

    await this.setupSlide4(
            prisma,
            slideshow,
            slideTemplates[3])

    await this.setupSlide5(
            prisma,
            slideshow,
            slideTemplates[4])

    await this.setupSlide6(
            prisma,
            slideshow,
            slideTemplates[5])
  }

  async setupSlide1(
          prisma: PrismaClient,
          slideshow: Slideshow,
          slideTemplate: SlideTemplate) {

    // Get existing slide 1 if present
    var introSlide = await
          slideModel.getByUniqueKey1(
            prisma,
            slideshow.id,
            slideTemplate.id)

    // Get/setup narration
    var narrationId: string | null = null

    if (introSlide?.narrationId != null) {
      narrationId = introSlide.narrationId

    } else {
      const narration = await
              this.setupSlide1Narration(prisma)

      narrationId = narration.id
    }

    // Get the imagePath for slideNo 1
    const generatedImage = await
            generatedImageModel.getByUniqueKey(
              prisma,
              `/images/nvda-test/nvda-invest-logo.png`)

    // Create the intro slide
    introSlide = await
      slideModel.upsert(
        prisma,
        undefined,  // id
        slideshow.id,
        slideTemplate.id,
        slideTemplate.slideNo,
        BaseDataTypes.activeStatus,
        slideTemplate.title,
        slideTemplate.textPrompt,
        narrationId,
        generatedImage.id)
  }

  async setupSlide1Narration(
          prisma: PrismaClient) {

    // Debug
    const fnName = `${this.clName}.setupSlide1Narration()`

    // Get the GeneratedAudios for slideNo 1
    const generatedAudio1 = await
            generatedAudioModel.getByUniqueKey(
              prisma,
              `/audio/nvda-test/overview-1.mp3`)

    const generatedAudio2 = await
            generatedAudioModel.getByUniqueKey(
              prisma,
              `/audio/nvda-test/overview-2.mp3`)

    // Validate
    if (generatedAudio1 == null) {
      throw new CustomError(
        `${fnName}: test generated audio 1 not found: first run the audio ` +
        `test`)
    }

    if (generatedAudio2 == null) {
      throw new CustomError(
        `${fnName}: test generated audio 2 not found: first run the audio ` +
        `test`)
    }

    // Create Narration
    const narration = await
            narrationModel.create(
              prisma,
              BaseDataTypes.activeStatus,
              ServerTestTypes.testNarrationUniqueRef)

    // Create NarrationSegments
    const narrationSegment1 = await
            narrationSegmentModel.create(
              prisma,
              narration.id,
              generatedAudio1.id,
              0,     // sentenceIndex
              0,     // segmentIndex
              `NVDA overview (segment 1)`,
              NarrationTones.confident,
              null)  // pauseMsAfter

    const narrationSegment2 = await
            narrationSegmentModel.create(
              prisma,
              narration.id,
              generatedAudio2.id,
              0,     // sentenceIndex
              1,     // segmentIndex
              `NVDA overview (segment 2)`,
              NarrationTones.emphasize,
              null)  // pauseMsAfter

    // Return
    return narration
  }

  async setupSlide2(
          prisma: PrismaClient,
          slideshow: Slideshow,
          slideTemplate: SlideTemplate) {

    // Create the requirements slide
    const requirementsSlide = await
            slideModel.upsert(
              prisma,
              undefined,  // id
              slideshow.id,
              slideTemplate.id,
              slideTemplate.slideNo,
              BaseDataTypes.activeStatus,
              slideTemplate.title,
              slideTemplate.textPrompt,
              null,       // narrationId
              null)       // generatedImageId
  }

  async setupSlide3(
          prisma: PrismaClient,
          slideshow: Slideshow,
          slideTemplate: SlideTemplate) {

    // Create the annual financials slide
    const annualFinancialsSlide = await
            slideModel.upsert(
              prisma,
              undefined,  // id
              slideshow.id,
              slideTemplate.id,
              slideTemplate.slideNo,
              BaseDataTypes.activeStatus,
              slideTemplate.title,
              slideTemplate.textPrompt,
              null,       // narrationId
              null)       // generatedImageId
  }

  async setupSlide4(
          prisma: PrismaClient,
          slideshow: Slideshow,
          slideTemplate: SlideTemplate) {

    // Create the quarterly financials slide
    const quarterlyFinancialsSlide = await
            slideModel.upsert(
              prisma,
              undefined,  // id
              slideshow.id,
              slideTemplate.id,
              slideTemplate.slideNo,
              BaseDataTypes.activeStatus,
              slideTemplate.title,
              slideTemplate.textPrompt,
              null,       // narrationId
              null)       // generatedImageId
  }

  async setupSlide5(
          prisma: PrismaClient,
          slideshow: Slideshow,
          slideTemplate: SlideTemplate) {

    // Create the daily chart slide
    const dailyChartSlide = await
            slideModel.upsert(
              prisma,
              undefined,  // id
              slideshow.id,
              slideTemplate.id,
              slideTemplate.slideNo,
              BaseDataTypes.activeStatus,
              slideTemplate.title,
              slideTemplate.textPrompt,
              null,       // narrationId
              null)       // generatedImageId
  }

  async setupSlide6(
          prisma: PrismaClient,
          slideshow: Slideshow,
          slideTemplate: SlideTemplate) {

    // Create the outro slide
    const outroSlide = await
            slideModel.upsert(
              prisma,
              undefined,  // id
              slideshow.id,
              slideTemplate.id,
              slideTemplate.slideNo,
              BaseDataTypes.activeStatus,
              slideTemplate.title,
              slideTemplate.textPrompt,
              null,       // narrationId,
              null)       // generatedImageId
  }
}
