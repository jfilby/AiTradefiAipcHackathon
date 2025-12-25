import { PrismaClient } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { ElevenLabsDefaults } from '@/types/elevenlabs-types'
import { ServerOnlyTypes } from '@/types/server-only-types'
import { ElevenLabsVoiceModel } from '@/models/generated-media/elevenlabs-voice-model'
import { GenerationsConfigModel } from '@/models/trade-analysis/generations-settings-model'

// Models
const elevenLabsVoiceModel = new ElevenLabsVoiceModel()
const generationsConfigModel = new GenerationsConfigModel()

// Class
export class GenerationsConfigSetupService {

  // Consts
  clName = 'GenerationsConfigSetupService'

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
    const generationsConfig = await
            generationsConfigModel.upsert(
              prisma,
              undefined,  // id
              adminUserProfileId,
              elevenLabsVoice.id,
              BaseDataTypes.activeStatus,
              true,       // sharedPublicly
              ServerOnlyTypes.defaultGenerationsConfigName,
              ServerOnlyTypes.defaultSlideShowSettings,
              ServerOnlyTypes.defaultVideoSettings)
  }
}
