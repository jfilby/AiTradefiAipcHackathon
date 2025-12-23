import { PrismaClient } from '@prisma/client'
import { ElevenLabsDefaults, NarrationTones, settingsByTone } from '@/types/elevenlabs-types'
import { ElevenLabsService } from '../elevenlabs/service'

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

    // Call tests
    await this.testTts1(prisma)
    await this.testTts2(prisma)
  }

  async testTts1(prisma: PrismaClient) {

    // Consts
    const prompt = `This is an overview of`
    const relativePath = `/audio/nvda-test/overview-1.mp3`

    // Get ElevenLabsSettings by tone
    const elevenLabsSettings = settingsByTone[NarrationTones.confident]

    // Generate text-to-speech and save it
    const generatedAudio = await
            elevenLabsService.generateTtsAndSave(
              prisma,
              ElevenLabsDefaults.defaultVoiceName,
              prompt,
              relativePath,
              elevenLabsSettings)
  }

  async testTts2(prisma: PrismaClient) {

    // Consts
    const prompt = `the NVDA stock's potential.`
    const relativePath = `/audio/nvda-test/overview-2.mp3`

    // Get ElevenLabsSettings by tone
    const elevenLabsSettings = settingsByTone[NarrationTones.emphasize]

    // Generate text-to-speech and save it
    const generatedAudio = await
            elevenLabsService.generateTtsAndSave(
              prisma,
              ElevenLabsDefaults.defaultVoiceName,
              prompt,
              relativePath,
              elevenLabsSettings)
  }
}
