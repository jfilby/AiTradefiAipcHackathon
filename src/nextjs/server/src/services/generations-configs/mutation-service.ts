import { GenerationsConfig, PrismaClient } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { ServerOnlyTypes } from '@/types/server-only-types'
import { GenerationsConfigModel } from '@/models/trade-analysis/generations-config-model'

// Models
const generationsConfigModel = new GenerationsConfigModel()

// Class
export class GenerationsConfigMutateService {

  // Consts
  clName = 'GenerationsConfigMutateService'

  // Code
  async upsert(
          prisma: PrismaClient,
          id: string,
          userProfileId: string,
          status: string,
          isDefault: boolean,
          name: string,
          elevenLabsVoiceId: string | null) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // If isDefault is true then set existing records' to false
    if (isDefault === true) {

      await generationsConfigModel.updateByUserProfileId(
              prisma,
              userProfileId,
              undefined,  // elevenLabsVoiceId
              undefined,  // status
              false)      // isDefault
    }

    // Get defaults
    const slideshowConfig = ServerOnlyTypes.defaultSlideShowConfig
    const videoConfig = ServerOnlyTypes.defaultVideoConfig

    // Upsert
    const generationsConfig = await
            generationsConfigModel.upsert(
              prisma,
              id,
              userProfileId,
              elevenLabsVoiceId,
              status,
              isDefault,
              false,  // sharedPublicly
              name,
              slideshowConfig,
              videoConfig)

    // Return
    return {
      status: true
    }
  }
}
