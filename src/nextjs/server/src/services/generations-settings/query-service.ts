import { PrismaClient } from '@prisma/client'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { GenerationsSettingsModel } from '@/models/trade-analysis/generations-settings-model'

// Models
const generationsSettingsModel = new GenerationsSettingsModel()

// Class
export class GenerationsSettingsQueryService {

  // Consts
  clName = 'GenerationsSettingsQueryService'

  // Code
  async getList(
          prisma: PrismaClient,
          userProfileId: string,
          status: string) {

    // Get all for the user + publicly shared
    const generationsSettings = await
            generationsSettingsModel.filterIncludingSharedPublicly(
              prisma,
              userProfileId,
              status,
              undefined)  // name

    // Return
    return {
      status: true,
      generationsSettings: generationsSettings
    }
  }
}
