import { PrismaClient } from '@prisma/client'
import { ElevenLabsDefaults, NarrationTones, settingsByTone } from '@/types/elevenlabs-types'
import { NarrationSegmentModel } from '@/models/slideshows/narration-segment-model'
import { ElevenLabsService } from './service'
import { CustomError } from '@/serene-core-server/types/errors'

// Services
const elevenLabsService = new ElevenLabsService()
const narrationSegmentModel = new NarrationSegmentModel()

// Class
export class NarrationAudioService {

  // Consts
  clName = 'NarrationAudioService'

  // Code
  async *generateFromReplyData(
           prisma: PrismaClient,
           userProfileId: string,
           replyData: any): AsyncGenerator<Buffer<ArrayBuffer>> {

    // Debug
    const fnName = `${this.clName}.generateFromReplyData()`

    // console.log(`${fnName}: starting..`)

    // Contents?
    if (replyData.contents == null) {
      return
    }

    // Process each sentence
    for (const message of replyData.contents) {

      // Lookup tone settings
      const tone = message.tone as string

      if (!this.isNarrationTone(tone)) {
        throw new CustomError(`${fnName}: tone: ${message.tone} not found`)
      }

      const elevenLabsSettings = settingsByTone[tone]

      // Generate TTS if enabled
      const audioBuffer = await
            elevenLabsService.generateTtsBufferIfEnabled(
              prisma,
              userProfileId,
              ElevenLabsDefaults.defaultVoiceName,
              message.text,
              elevenLabsSettings)

      // Yield
      if (audioBuffer != null) {
        yield audioBuffer
      }
    }
  }

  async generateFromSlideData(
          prisma: PrismaClient,
          narrationId: string) {

    // Debug
    const fnName = `${this.clName}.generateFromSlideData()`

    // Get segments
    const narrationSegments = await
            narrationSegmentModel.getByNarrationId(
              prisma,
              narrationId)

    // Validate
    if (narrationSegments == null) {
      throw new CustomError(`${fnName}: narrationSegments == null`)
    }

    // Process each segment
    for (const narrationSegment of narrationSegments) {

      // Lookup tone settings
      if (!this.isNarrationTone(narrationSegment.tone)) {

        throw new CustomError(
          `${fnName}: tone: ${narrationSegment.tone} not found`)
      }

      const elevenLabsSettings = settingsByTone[narrationSegment.tone]

      // Define relativePath
      const relativePath =
        `/audio/narrations/${narrationId}/${narrationSegment.id}.mp3`

      // Generate audio
      const generatedAudio = await
              elevenLabsService.generateTtsAndSave(
                prisma,
                ElevenLabsDefaults.defaultVoiceName,
                narrationSegment.text,
                relativePath,
                elevenLabsSettings)

      // Save generatedAudio.id
      const narrationSegmentSaved = await
              narrationSegmentModel.update(
                prisma,
                narrationSegment.id,
                undefined,  // narrationId
                generatedAudio.id)
    }
  }

  isNarrationTone(value: string): value is NarrationTones {
    return Object.values(NarrationTones).includes(value as NarrationTones)
  }
}
