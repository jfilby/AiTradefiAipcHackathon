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
    requirementsSlide: true
  }

  defaultVideoSettings = {
    requirementsIntro: true
  }

  // Code
  async setup(
          prisma: PrismaClient,
          adminUserProfileId: string) {

    // Try to get
    var generationsSettings = await
          generationsSettingsModel.getByUniqueKey(
            prisma,
            adminUserProfileId,
            ServerOnlyTypes.defaultGenerationsSettingsName)

    if (generationsSettings != null) {
      return
    }

    // Create
    generationsSettings = await
      generationsSettingsModel.create(
        prisma,
        adminUserProfileId,
        BaseDataTypes.activeStatus,
        true,  // sharedPublicly
        ServerOnlyTypes.defaultGenerationsSettingsName,
        this.defaultSlideShowSettings,
        this.defaultVideoSettings)
  }
}
