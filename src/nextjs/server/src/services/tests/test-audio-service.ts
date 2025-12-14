import { PrismaClient } from '@prisma/client'
import { ElevenLabsTypes } from '@/shared/types/elevenlabs_types'
import { ElevenLabsService } from '../generated-data/elevenlabs/service'

// Services
const elevenLabsService = new ElevenLabsService()

// Class
export class CreateTestAudioService {

  // Consts
  clName = 'CreateTestAudioService'

  // Code
  async getVoices() {

    await elevenLabsService.getVoices()
  }

  async testTTS(prisma: PrismaClient) {

    // Debug
    const fnName = `${this.clName}.testTTS()`

    // Consts
    const prompt = `This is an overview of the NVDA stock's potential.`
    const relativePath = `/audio/nvda-test/overview.mp3`

    // Generate text-to-speech and save it
    const response = await
            elevenLabsService.generateTTS(
              ElevenLabsTypes.defaultVoiceName,
              prompt,
              relativePath)
  }
}
