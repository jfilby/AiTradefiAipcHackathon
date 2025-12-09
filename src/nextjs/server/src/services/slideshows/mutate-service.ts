import { PrismaClient } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { SlideModel } from '@/models/slideshows/slide-model'
import { SlideshowModel } from '@/models/slideshows/slideshow-model'

// Models
const slideModel = new SlideModel()
const slideshowModel = new SlideshowModel()

// Class
export class SlideshowMutateService {

  // Consts
  clName = 'SlideshowMutateService'

  // Code
  async createNextSlide(
          prisma: PrismaClient,
          slideshowId: string) {

    // Debug
    const fnName = `${this.clName}.createNextSlide()`

    // Get last slide
    const lastSlides = await
            slideModel.getLastSlides(
              prisma,
              slideshowId,
              1)

    // Use previous slides to determine the next index
    var nextIndex = 0

    if (lastSlides.length > 0) {

      // Last slide
      const lastSlide = lastSlides[0]

      // Previous slide already in progress?
      if (lastSlide.status === BaseDataTypes.newStatus) {

        console.log(`${fnName}: next slide creation already in-progress`)
        return
      }

      // Did the last created slide fail?
      if (lastSlide.status === BaseDataTypes.failedStatus) {

        throw new CustomError(
          `${fnName}: slide with slideshowId: ${lastSlide.slideshowId} ` +
          `index: ${lastSlide.index} failed, address the issue first`)
      }

      // Get last completed slide
      if (lastSlide.status === BaseDataTypes.activeStatus) {
        nextIndex = lastSlide.index + 1
      }
    }

    // Create slide
    const slide = await
            this.createSlide(
              prisma,
              slideshowId,
              nextIndex)
  }

  async createSlide(
          prisma: PrismaClient,
          slideshowId: string,
          index: number) {

    // Debug
    const fnName = `${this.clName}.createSlide()`

    // Get the current max slideNo
    const maxSlide = await
            slideModel.getMaxSlideNo(
              prisma,
              slideshowId)

    var maxSlideNo = 0

    if (maxSlide._max.slideNo != null) {
      maxSlideNo = maxSlide._max.slideNo
    }

    // Create new Slide
    var slide = await
          slideModel.create(
            prisma,
            slideshowId,
            index,
            maxSlideNo + 1,
            BaseDataTypes.newStatus,
            'TYP',        // type
            `New slide`,  // title
            null,         // text
            null,         // audioPath
            null)         // imagePath

    // Generate resources
    ;

    // Update Slide to active
    ;
  }

  async getOrCreate(
          prisma: PrismaClient,
          tradeAnalysisId: string) {

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
  }
}
