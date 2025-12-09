import { PrismaClient } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { SlideTemplateModel } from '@/models/slideshows/slide-template-model'

// Models
const slideTemplateModel = new SlideTemplateModel()

// Class
export class SlideTemplatesMutateService {

  // Consts
  clName = 'SlideTemplatesMutateService'

  // Code
  async create(
          prisma: PrismaClient,
          analysisId: string) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Get prompt
    ;
  }

  getPrompt() {

    ;
  }

  async recreate(
          prisma: PrismaClient,
          analysisId: string) {

    // Debug
    const fnName = `${this.clName}.recreate()`

    // Validate that no slideshow is based on this template
    const exists = await
            slideTemplateModel.existsByAnalysisId(
              prisma,
              analysisId)

    if (exists === true) {
      throw new CustomError(`${fnName}: slide templates already exist`)
    }

    // Create slide templates
    await this.create(
            prisma,
            analysisId)
  }
}
