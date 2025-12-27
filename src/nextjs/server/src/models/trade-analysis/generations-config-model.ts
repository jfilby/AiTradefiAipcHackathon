import { PrismaClient } from '@prisma/client'

export class GenerationsConfigModel {

  // Consts
  clName = 'GenerationsConfigModel'

  // Code
  async create(
          prisma: PrismaClient,
          userProfileId: string,
          elevenLabsVoiceId: string | null,
          status: string,
          isDefault: boolean,
          sharedPublicly: boolean,
          name: string,
          slideshowConfig: any,
          videoConfig: any) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.generationsConfig.create({
        data: {
          userProfileId: userProfileId,
          elevenLabsVoiceId: elevenLabsVoiceId,
          status: status,
          isDefault: isDefault,
          sharedPublicly: sharedPublicly,
          name: name,
          slideshowConfig: slideshowConfig,
          videoConfig: videoConfig
        }
      })
    } catch(error) {
      console.error(`${fnName}: error: ${error}`)
      throw error
    }
  }

  async deleteById(
          prisma: PrismaClient,
          id: string) {

    // Debug
    const fnName = `${this.clName}.deleteById()`

    // Delete
    try {
      return await prisma.generationsConfig.delete({
        where: {
          id: id
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }
  }

  async filter(
          prisma: PrismaClient,
          userProfileId: string | undefined = undefined,
          elevenLabsVoiceId: string | null | undefined = undefined,
          status: string | undefined = undefined,
          isDefault: boolean | undefined = undefined,
          sharedPublicly: boolean | undefined = undefined,
          name: string | undefined = undefined,
          includeElevenLabsVoice: boolean = false) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query
    try {
      return await prisma.generationsConfig.findMany({
        include: {
          elevenLabsVoice: includeElevenLabsVoice
        },
        where: {
          userProfileId: userProfileId,
          elevenLabsVoiceId: elevenLabsVoiceId,
          status: status,
          isDefault: isDefault,
          sharedPublicly: sharedPublicly,
          name: name
        },
        orderBy: [
          {
            isDefault: 'desc'
          },
          {
            name: 'asc'
          }
        ]
      })
    } catch(error: any) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async filterIncludingSharedPublicly(
          prisma: PrismaClient,
          userProfileId: string | undefined = undefined,
          status: string | undefined = undefined,
          name: string | undefined = undefined) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query
    try {
      return await prisma.generationsConfig.findMany({
        where: {
          OR: [
            {
              sharedPublicly: true
            },
            {
              userProfileId: userProfileId,
              status: status,
              sharedPublicly: false,
              name: name
            }
          ]
        },
        orderBy: [
          {
            sharedPublicly: 'desc'  // true, then false
          },
          {
            isDefault: 'desc'
          },
          {
            name: 'asc'
          }
        ]
      })
    } catch(error: any) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async getById(
          prisma: PrismaClient,
          id: string) {

    // Debug
    const fnName = `${this.clName}.getById()`

    // Query
    var generationsConfig: any = null

    try {
      generationsConfig = await prisma.generationsConfig.findUnique({
        where: {
          id: id
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return generationsConfig
  }

  async getByUniqueKey(
          prisma: PrismaClient,
          userProfileId: string,
          name: string) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Validate
    if (userProfileId == null) {
      console.error(`${fnName}: userProfileId == null`)
      throw 'Validation error'
    }

    if (name == null) {
      console.error(`${fnName}: name == null`)
      throw 'Validation error'
    }

    // Query
    var generationsConfig: any = null

    try {
      generationsConfig = await prisma.generationsConfig.findFirst({
        where: {
          userProfileId: userProfileId,
          name: name
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return generationsConfig
  }

  async update(
          prisma: PrismaClient,
          id: string,
          userProfileId: string | undefined = undefined,
          elevenLabsVoiceId: string | null | undefined = undefined,
          status: string | undefined = undefined,
          isDefault: boolean | undefined = undefined,
          sharedPublicly: boolean | undefined = undefined,
          name: string | undefined = undefined,
          slideshowConfig: any = undefined,
          videoConfig: any = undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.generationsConfig.update({
        data: {
          userProfileId: userProfileId,
          elevenLabsVoiceId: elevenLabsVoiceId,
          status: status,
          isDefault: isDefault,
          sharedPublicly: sharedPublicly,
          name: name,
          slideshowConfig: slideshowConfig,
          videoConfig: videoConfig
        },
        where: {
          id: id
        }
      })
    } catch(error) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async updateByUserProfileId(
          prisma: PrismaClient,
          userProfileId: string,
          elevenLabsVoiceId: string | null | undefined = undefined,
          status: string | undefined = undefined,
          isDefault: boolean | undefined = undefined,
          sharedPublicly: boolean | undefined = undefined,
          name: string | undefined = undefined,
          slideshowConfig: any = undefined,
          videoConfig: any = undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.generationsConfig.updateMany({
        data: {
          elevenLabsVoiceId: elevenLabsVoiceId,
          status: status,
          isDefault: isDefault,
          sharedPublicly: sharedPublicly,
          name: name,
          slideshowConfig: slideshowConfig,
          videoConfig: videoConfig
        },
        where: {
          userProfileId: userProfileId
        }
      })
    } catch(error) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async upsert(
          prisma: PrismaClient,
          id: string | undefined,
          userProfileId: string | undefined,
          elevenLabsVoiceId: string | null | undefined,
          status: string | undefined,
          isDefault: boolean | undefined,
          sharedPublicly: boolean | undefined,
          name: string | undefined,
          slideshowConfig: any,
          videoConfig: any) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    console.log(`${fnName}: starting with id: ` + JSON.stringify(id))

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        userProfileId != null &&
        name != null) {

      const generationsConfig = await
              this.getByUniqueKey(
                prisma,
                userProfileId,
                name)

      if (generationsConfig != null) {
        id = generationsConfig.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (userProfileId == null) {
        console.error(`${fnName}: id is null and userProfileId is null`)
        throw 'Prisma error'
      }

      if (elevenLabsVoiceId === undefined) {
        console.error(`${fnName}: id is null and elevenLabsVoiceId is undefined`)
        throw 'Prisma error'
      }

      if (status == null) {
        console.error(`${fnName}: id is null and status is null`)
        throw 'Prisma error'
      }

      if (isDefault == null) {
        console.error(`${fnName}: id is null and isDefault is null`)
        throw 'Prisma error'
      }

      if (sharedPublicly == null) {
        console.error(`${fnName}: id is null and sharedPublicly is null`)
        throw 'Prisma error'
      }

      if (name == null) {
        console.error(`${fnName}: id is null and name is null`)
        throw 'Prisma error'
      }

      if (slideshowConfig === undefined) {
        console.error(`${fnName}: id is null and slideshowConfig is undefined`)
        throw 'Prisma error'
      }

      if (videoConfig === undefined) {
        console.error(`${fnName}: id is null and videoConfig is undefined`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 userProfileId,
                 elevenLabsVoiceId,
                 status,
                 isDefault,
                 sharedPublicly,
                 name,
                 slideshowConfig,
                 videoConfig)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 userProfileId,
                 elevenLabsVoiceId,
                 status,
                 isDefault,
                 sharedPublicly,
                 name,
                 slideshowConfig,
                 videoConfig)
    }
  }
}
