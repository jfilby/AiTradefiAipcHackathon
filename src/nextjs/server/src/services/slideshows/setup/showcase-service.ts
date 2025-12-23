import { PrismaClient } from '@prisma/client'
import { ConsoleService } from '@/serene-core-server/services/console/service'
import { SlideshowShowcaseModel } from '@/models/slideshows/slideshow-showcase-model'

// Models
const slideshowShowcaseModel = new SlideshowShowcaseModel()

// Services
const consoleService = new ConsoleService()

// Class
export class SlideshowShowcaseService {

  // Consts
  clName = 'SlideshowShowcaseService'

  // Code
  async setup(prisma: PrismaClient) {

    // Prompt for slideshow to add to the showcase
    const slideshowId = await
            consoleService.askQuestion('slideshowId> ')

    // Load the slideshow into the showcase
    const slideshowShowcase = await
           slideshowShowcaseModel.upsert(
            prisma,
            undefined,  // id
            slideshowId)
  }
}
