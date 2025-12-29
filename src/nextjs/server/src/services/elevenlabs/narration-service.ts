import { ElevenLabsVoice, PrismaClient } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { ElevenLabsDefaults, NarrationTones, settingsByTone } from '@/types/elevenlabs-types'
import { ElevenLabsVoiceModel } from '@/models/generated-media/elevenlabs-voice-model'
import { NarrationSegmentModel } from '@/models/slideshows/narration-segment-model'
import { GenerationsConfigModel } from '@/models/trade-analysis/generations-config-model'
import { ElevenLabsService } from './service'

// Models
const elevenLabsVoiceModel = new ElevenLabsVoiceModel()
const generationsConfigModel = new GenerationsConfigModel()

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
           generationsConfigId: string,
           replyData: any): AsyncGenerator<Buffer<ArrayBuffer>> {

    // Debug
    const fnName = `${this.clName}.generateFromReplyData()`

    // console.log(`${fnName}: starting..`)

    // Contents?
    if (replyData.contents == null) {
      return
    }

    // Get GenerationsConfig
    const generationsConfig = await
            generationsConfigModel.getById(
              prisma,
              generationsConfigId,
              true)  // includeElevenLabsVoice

    // Get ElevenLabsVoice
    var elevenLabsVoice: ElevenLabsVoice | undefined = undefined

    if (generationsConfig?.elevenLabsVoice != null) {
      elevenLabsVoice = generationsConfig.elevenLabsVoice

    } else {
      elevenLabsVoice = await
        elevenLabsVoiceModel.getByName(
          prisma,
          ElevenLabsDefaults.defaultVoiceName)
    }

    // Validate
    if (elevenLabsVoice == null) {
      throw new CustomError(`${fnName}: elevenLabsVoice == null`)
    }

    // Process each sentence
    for (const message of replyData.contents) {

      // Skip if no tone set (e.g. metadata)
      if (message.tone == null) {
        continue
      }

      // Lookup tone settings
      const tone = message.tone as string

      if (!this.isNarrationTone(tone)) {
        throw new CustomError(`${fnName}: tone: ${message.tone} not found`)
      }

      const elevenLabsSettings = settingsByTone[tone]

      // Process message text for narration
      const text = this.processTextForNarration(message.text)

      // Generate TTS if enabled
      const audioBuffer = await
            elevenLabsService.generateTtsBufferIfEnabled(
              prisma,
              userProfileId,
              elevenLabsVoice,
              text,
              elevenLabsSettings)

      // Yield
      if (audioBuffer != null) {
        yield audioBuffer
      }
    }
  }

  async generateFromSlideData(
          prisma: PrismaClient,
          elevenLabsVoice: ElevenLabsVoice,
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

      // Process message text for narration
      const text = this.processTextForNarration(narrationSegment.text)

      // Define relativePath
      const relativePath =
        `/audio/narrations/${narrationId}/${narrationSegment.id}.mp3`

      // Generate audio
      const generatedAudio = await
              elevenLabsService.generateTtsAndSave(
                prisma,
                elevenLabsVoice,
                text,
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

  processTextForNarration(input: string) {

    const result = this.replaceCaseInsensitive(
      input,
      'aitradefi',
      'a-i-trade-fi')

    return result
  }

  replaceCaseInsensitive(input: string, findStr: string, replaceStr: string) {

    const regex = new RegExp(findStr, 'gi')
    return input.replace(regex, replaceStr)
  }
}
