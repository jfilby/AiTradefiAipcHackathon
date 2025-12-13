import { PrismaClient, SlideTemplate } from '@prisma/client'

export class GenSlideAudioService {

  // Consts
  clName = 'GenSlideAudioService'

  // Code
  async generate(
          prisma: PrismaClient,
          slideTemplate: SlideTemplate) {

    return null
  }
}
