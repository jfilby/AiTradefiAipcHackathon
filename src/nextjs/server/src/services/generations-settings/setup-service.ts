import { PrismaClient } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { ElevenLabsDefaults } from '@/types/elevenlabs-types'
import { ServerOnlyTypes } from '@/types/server-only-types'
import { ElevenLabsVoiceModel } from '@/models/generated-media/elevenlabs-voice-model'
import { GenerationsSettingsModel } from '@/models/trade-analysis/generations-settings-model'

// Models
const elevenLabsVoiceModel = new ElevenLabsVoiceModel()
const generationsSettingsModel = new GenerationsSettingsModel()

// Class
export class GenerationsSettingsSetupService {

  // Consts
  clName = 'GenerationsSettingsSetupService'

  // Code
  async setup(
          prisma: PrismaClient,
          adminUserProfileId: string) {

    // Debug
    const fnName = `${this.clName}.setup()`

    // Get the default ElevenLabsVoice
    const elevenLabsVoice = await
            elevenLabsVoiceModel.getByName(
              prisma,
              ElevenLabsDefaults.defaultVoiceName)

    // Validate
    if (elevenLabsVoice == null) {
      throw new CustomError(`${fnName}: elevenLabsVoice == null`)
    }

    // Create
    const generationsSettings = await
            generationsSettingsModel.upsert(
              prisma,
              undefined,  // id
              adminUserProfileId,
              elevenLabsVoice.id,
              BaseDataTypes.activeStatus,
              true,       // sharedPublicly
              ServerOnlyTypes.defaultGenerationsSettingsName,
              ServerOnlyTypes.defaultSlideShowSettings,
              ServerOnlyTypes.defaultVideoSettings)
  }
}
