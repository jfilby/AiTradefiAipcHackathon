import { PrismaClient, SlideTemplate } from '@prisma/client'

export class GenSlideImageService {

  // Consts
  clName = 'GenSlideImageService'

  // Code
  async generate(
          prisma: PrismaClient,
          slideTemplate: SlideTemplate) {

    return null
  }
}
