import { PrismaClient } from '@prisma/client'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { ServerOnlyTypes } from '@/types/server-only-types'
import { GenerationsSettingsModel } from '@/models/trade-analysis/generations-settings-model'

// Models
const generationsSettingsModel = new GenerationsSettingsModel()

// Class
export class GenerationsSettingsSetupService {

  // Consts
  clName = 'GenerationsSettingsSetupService'

  defaultSlideShowSettings = {
    withIntroImage: false,
    requirementsSlide: true,
    withAudioNarration: true,
  }

  defaultVideoSettings = {
    withIntroImage: false,
    requirementsIntro: true,
    withAudioNarration: true,
  }

  // Code
  async setup(
          prisma: PrismaClient,
          adminUserProfileId: string) {

    // Create
    const generationsSettings = await
            generationsSettingsModel.upsert(
              prisma,
              undefined,  // id
              adminUserProfileId,
              BaseDataTypes.activeStatus,
              true,       // sharedPublicly
              ServerOnlyTypes.defaultGenerationsSettingsName,
              this.defaultSlideShowSettings,
              this.defaultVideoSettings)
  }
}
