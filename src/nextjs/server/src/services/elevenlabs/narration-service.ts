import { PrismaClient } from '@prisma/client'
import { ElevenLabsDefaults, ElevenLabsSettings, NarrationTones, settingsByTone } from '@/types/elevenlabs-types'
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
  async generateFromReplyData(
          prisma: PrismaClient,
          userProfileId: string,
          replyData: any) {

    // Define ElevenLabsSettings
    const elevenLabsSettings: ElevenLabsSettings = {
      stability: ElevenLabsDefaults.stability,
      similarityBoost: ElevenLabsDefaults.similarityBoost
    }

    if (replyData.chatJson.rawJson) {

      for (const entry of replyData.chatJson.rawJson) {

        if (entry.elevenLabsSettings != null) {

          if (entry.elevenLabsSettings.stability != null) {
            elevenLabsSettings.stability = entry.elevenLabsSettings.stability
          }

          if (entry.elevenLabsSettings.similarityBoost != null) {
            elevenLabsSettings.similarityBoost =
              entry.elevenLabsSettings.similarityBoost
          }

          if (entry.elevenLabsSettings.style != null) {
            elevenLabsSettings.style = entry.elevenLabsSettings.style
          }

          if (entry.elevenLabsSettings.speed != null) {
            elevenLabsSettings.speed = entry.elevenLabsSettings.speed
          }
        }
      }
    }

    // TTS if enabled
    const audioBuffer = await
            elevenLabsService.generateTtsFromChatMessagesIfEnabled(
              prisma,
              userProfileId,
              replyData,
              elevenLabsSettings)

    // Return
    return audioBuffer
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
