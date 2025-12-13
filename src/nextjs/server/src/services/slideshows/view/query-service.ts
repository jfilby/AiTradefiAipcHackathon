import { PrismaClient } from '@prisma/client'
import { SlideshowModel } from '@/models/slideshows/slideshow-model'

// Models
const slideshowModel = new SlideshowModel()

// Class
export class SlideshowsQueryService {

  // Consts
  clName = 'SlideshowsQueryService'

  // Code
  async getById(
          prisma: PrismaClient,
          userProfileId: string,
          slideshowId: string,
          includeSlides: boolean = false) {

    // Query
    const slideshow = await
            slideshowModel.getById(
              prisma,
              slideshowId,
              includeSlides)

    // Adjust slides name
    slideshow.slides = slideshow.ofSlides

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
