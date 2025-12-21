import { PrismaClient, Slide } from '@prisma/client'
import { ElevenLabsTypes } from '@/shared/types/elevenlabs-types'
import { ElevenLabsService } from '@/services/elevenlabs/service'

// Services
const elevenLabsService = new ElevenLabsService()

// Class
export class GenSlideAudioService {

  // Consts
  clName = 'GenSlideAudioService'

  // Code
  async generate(
          prisma: PrismaClient,
          slide: Slide) {

    // Define relativePath
    const relativePath =
            `/audio/slideshows/${slide.slideshowId}/slide_${slide.id}.mp3`

    // Generate narration
    const generatedAudio = await
            elevenLabsService.generateTtsAndSave(
              ElevenLabsTypes.defaultVoiceName,
              slide.narratedText,
              relativePath)

    // Return
    return generatedAudio.id
  }
}
