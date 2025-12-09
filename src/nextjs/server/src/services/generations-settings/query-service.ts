import { PrismaClient } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { GenerationsSettingsModel } from '@/models/trade-analysis/generations-settings-model'

// Models
const generationsSettingsModel = new GenerationsSettingsModel()

// Class
export class GenerationsSettingsQueryService {

  // Consts
  clName = 'GenerationsSettingsQueryService'

  // Code
  async getDefault(prisma: PrismaClient) {

    // Debug
    const fnName = `${this.clName}.getDefault()`

    // Get publicly shared
    const generationsSettings = await
            generationsSettingsModel.filter(
              prisma,
              undefined,  // userProfileId
              BaseDataTypes.activeStatus,
              true)       // sharedPublicly

    // Validate
    if (generationsSettings.length === 0) {
      throw new CustomError(
                  `${fnName}: publicly shared generationsSettings not found`)
    }

    // Return
    return generationsSettings[0]
  }

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
