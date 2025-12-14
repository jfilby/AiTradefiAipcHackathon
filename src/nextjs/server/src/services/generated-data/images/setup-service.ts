import { PrismaClient } from '@prisma/client'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { GeneratedImageModel } from '@/models/generated-media/generated-image-model'
import { AiTechDefs } from '@/serene-ai-server/types/tech-defs'

// Models
const generatedImageModel = new GeneratedImageModel()

// Class
export class SetupPreGeneratedImagesService {

  // Consts
  clName = 'SetupPreGeneratedImagesService'

  model = AiTechDefs.googleGemini_V2pt5FlashImageFree

  data = [
    {
      model: this.model,
      relativePath: `/images/nvda-test/nvda-invest-logo.png`,
      prompt: `An NVDA symbol logo surrounded by dollars and question marks`
    }
  ]

  // Code
  async setup(prisma: PrismaClient) {

    for (const entry of this.data) {

      await this.setupByImagePath(
              prisma,
              entry.model,
              entry.relativePath,
              entry.prompt)
    }
  }

  async setupByImagePath(
          prisma: PrismaClient,
          model: string,
          relativePath: string,
          prompt: string) {

    // Register pre-generated images
    var generatedImage = await
          generatedImageModel.getByUniqueKey(
            prisma,
            relativePath)

    if (generatedImage != null) {
      return
    }

    // Create GeneratedImage
    generatedImage = await
      generatedImageModel.create(
        prisma,
        BaseDataTypes.activeStatus,
        model,
        prompt,
        relativePath)
  }
}
