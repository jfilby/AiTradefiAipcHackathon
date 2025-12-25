import { PrismaClient } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { NarrationTones, settingsByTone } from '@/types/elevenlabs-types'
import { ElevenLabsVoiceModel } from '@/models/generated-media/elevenlabs-voice-model'
import { GeneratedAudioModel } from '@/models/generated-media/generated-audio-model'
import { ElevenLabsService } from './service'

// Models
const elevenLabsVoiceModel = new ElevenLabsVoiceModel()
const generatedAudioModel = new GeneratedAudioModel()

// Services
const elevenLabsService = new ElevenLabsService()

// Class
export class ElevenLabsVoiceService {

  // Consts
  clName = 'ElevenLabsVoiceService'

  // Code
  async generateVoicePreviewAudio(
          prisma: PrismaClient,
          elevenLabsVoiceId: string) {

    // Debug
    const fnName = `${this.clName}.generateVoicePreviewAudio()`

    // Get the ElevenLabsVoice record
    const elevenLabsVoice = await
            elevenLabsVoiceModel.getById(
              prisma,
              elevenLabsVoiceId)

    if (elevenLabsVoice == null) {
      throw new CustomError(`${fnName}: elevenLabsVoice == null`)
    }

    // Determine the relativePath
    const relativePath =
            `${process.env.BASE_DATA_PATH}/audio/voice-test/` +
            `${elevenLabsVoice.voiceId}.mp3`

    // Get GeneratedAudio record if available
    var generatedAudio = await
          generatedAudioModel.getByUniqueKey(
            prisma,
            relativePath)

    if (generatedAudio != null) {
      return {
        status: true,
        generatedAudioId: generatedAudio.id
      }
    }

    // Get neutral tone
    const elevenLabsSettings = settingsByTone[NarrationTones.neutral]

    // Define text
    const text = `Here's a quick preview of the voice you've selected.`

    // Generate test audio
    generatedAudio = await
      elevenLabsService.generateTtsAndSave(
        prisma,
        elevenLabsVoice,
        text,
        relativePath,
        elevenLabsSettings)

    // Return
    return {
      status: true,
      generatedAudioId: generatedAudio.id
    }
  }
}
