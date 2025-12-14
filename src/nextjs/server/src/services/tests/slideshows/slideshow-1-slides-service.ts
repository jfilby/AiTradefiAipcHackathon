import { Analysis, PrismaClient, Slideshow, SlideTemplate } from '@prisma/client'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { GeneratedAudioModel } from '@/models/generated-media/generated-audio-model'
import { GeneratedImageModel } from '@/models/generated-media/generated-image-model'
import { SlideModel } from '@/models/slideshows/slide-model'
import { SlideTemplateModel } from '@/models/slideshows/slide-template-model'

// Models
const generatedAudioModel = new GeneratedAudioModel()
const generatedImageModel = new GeneratedImageModel()
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
  }

  async setupSlide1(
          prisma: PrismaClient,
          slideshow: Slideshow,
          slideTemplate: SlideTemplate) {

    // Get the audioPath for slideNo 1
    const generatedAudio = await
            generatedAudioModel.getByUniqueKey(
              prisma,
              `/audio/nvda-test/overview.mp3`)

    // Get the imagePath for slideNo 1
    const generatedImage = await
            generatedImageModel.getByUniqueKey(
              prisma,
              `/images/nvda-test/nvda-invest-logo.png`)

    // Create the intro slide
    const introSlide = await
            slideModel.upsert(
              prisma,
              undefined,  // id
              slideshow.id,
              slideTemplate.id,
              slideTemplate.slideNo,
              BaseDataTypes.activeStatus,
              slideTemplate.title,
              slideTemplate.textPrompt,
              generatedAudio.id,
              generatedImage.id)
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
              null,  // generatedAudioId,
              null)  // generatedImageId
  }

}
