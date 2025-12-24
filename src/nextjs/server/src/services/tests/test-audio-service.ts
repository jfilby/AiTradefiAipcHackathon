import { ElevenLabsVoice, PrismaClient } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { ElevenLabsDefaults, NarrationTones, settingsByTone } from '@/types/elevenlabs-types'
import { ElevenLabsVoiceModel } from '@/models/generated-media/elevenlabs-voice-model'
import { ElevenLabsService } from '../elevenlabs/service'

// Models
const elevenLabsVoiceModel = new ElevenLabsVoiceModel()

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

    // Get default voice
    const elevenLabsVoice = await
            elevenLabsVoiceModel.getByName(
              prisma,
              ElevenLabsDefaults.defaultVoiceName)

    // Validate
    if (elevenLabsVoice == null) {
      throw new CustomError(`${fnName}: elevenLabsVoice == null`)
    }

    // Call tests
    await this.testTts1(
            prisma,
            elevenLabsVoice)

    await this.testTts2(
            prisma,
            elevenLabsVoice)
  }

  async testTts1(
          prisma: PrismaClient,
          elevenLabsVoice: ElevenLabsVoice) {

    // Consts
    const prompt = `This is an overview of`
    const relativePath = `/audio/nvda-test/overview-1.mp3`

    // Get ElevenLabsSettings by tone
    const elevenLabsSettings = settingsByTone[NarrationTones.confident]

    // Generate text-to-speech and save it
    const generatedAudio = await
            elevenLabsService.generateTtsAndSave(
              prisma,
              elevenLabsVoice,
              prompt,
              relativePath,
              elevenLabsSettings)
  }

  async testTts2(
          prisma: PrismaClient,
          elevenLabsVoice: ElevenLabsVoice) {

    // Consts
    const prompt = `the NVDA stock's potential.`
    const relativePath = `/audio/nvda-test/overview-2.mp3`

    // Get ElevenLabsSettings by tone
    const elevenLabsSettings = settingsByTone[NarrationTones.emphasize]

    // Generate text-to-speech and save it
    const generatedAudio = await
            elevenLabsService.generateTtsAndSave(
              prisma,
              elevenLabsVoice,
              prompt,
              relativePath,
              elevenLabsSettings)
  }
}
