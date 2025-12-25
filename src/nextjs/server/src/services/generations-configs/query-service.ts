import { PrismaClient } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { GenerationsConfigModel } from '@/models/trade-analysis/generations-settings-model'

// Models
const generationsConfigModel = new GenerationsConfigModel()

// Class
export class GenerationsConfigQueryService {

  // Consts
  clName = 'GenerationsConfigQueryService'

  // Code
  async getById(
          prisma: PrismaClient,
          userProfileId: string,
          id: string) {

    // Get by id
    const generationsConfig = await
            generationsConfigModel.getById(
              prisma,
              id)

    // Return
    return {
      status: true,
      generationsConfig: generationsConfig
    }
  }

  async getByFilter(
          prisma: PrismaClient,
          userProfileId: string,
          status: string) {

    // Get by id
    const generationsConfigs = await
            generationsConfigModel.filter(
              prisma,
              userProfileId,
              undefined,  // elevenLabsVoiceId
              status)

    // Return
    return {
      status: true,
      generationsConfigs: generationsConfigs
    }
  }

  async getDefault(prisma: PrismaClient) {

    // Debug
    const fnName = `${this.clName}.getDefault()`

    // Get publicly shared
    const generationsConfig = await
            generationsConfigModel.filter(
              prisma,
              undefined,  // userProfileId
              undefined,  // elevenLabsVoiceId
              BaseDataTypes.activeStatus,
              true)       // sharedPublicly

    // Validate
    if (generationsConfig.length === 0) {
      throw new CustomError(
                  `${fnName}: publicly shared generationsConfig not found`)
    }

    // Return
    return generationsConfig[0]
  }

  async getList(
          prisma: PrismaClient,
          userProfileId: string,
          status: string) {

    // Get all for the user + publicly shared
    const generationsConfig = await
            generationsConfigModel.filterIncludingSharedPublicly(
              prisma,
              userProfileId,
              status,
              undefined)  // name

    // Return
    return {
      status: true,
      generationsConfig: generationsConfig
    }
  }
}
