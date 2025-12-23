import { PrismaClient, Slide } from '@prisma/client'
import { NarrationAudioService } from '@/services/elevenlabs/narration-service'

// Services
const narrationAudioService = new NarrationAudioService()

// Class
export class GenSlideAudioService {

  // Consts
  clName = 'GenSlideAudioService'

  // Code
  async generate(
          prisma: PrismaClient,
          slide: Slide) {

    // Debug
    const fnName = `${this.clName}.generate()`

    // Define relativePath
    const relativePath =
            `/audio/slideshows/${slide.slideshowId}/slide_${slide.id}.mp3`

    // Generate narration
    const narration = await
            narrationAudioService.generateFromSlideData(
              prisma,
              slide.narratedText,
              relativePath)

    // Return
    return narration.id
  }
}
