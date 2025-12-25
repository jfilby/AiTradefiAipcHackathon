import { PrismaClient } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { GenerationsConfigModel } from '@/models/trade-analysis/generations-settings-model'

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
          name: string,
          elevenLabsVoiceId: string | null) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // Upsert
    const generationsConfig = await
            generationsConfigModel.upsert(
              prisma,
              id,
              userProfileId,
              elevenLabsVoiceId,
              status,
              false,  // sharedPublicly
              name,
              null,   // slideshowSettings
              null)   // videoSettings

    // Return
    return {
      status: true
    }
  }
}
