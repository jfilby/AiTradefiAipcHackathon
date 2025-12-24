import { PrismaClient } from '@prisma/client'

export class GenerationsSettingsModel {

  // Consts
  clName = 'GenerationsSettingsModel'

  // Code
  async create(
          prisma: PrismaClient,
          userProfileId: string,
          elevenLabsVoiceId: string | null,
          status: string,
          sharedPublicly: boolean,
          name: string,
          slideshowSettings: any,
          videoSettings: any) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.generationsSettings.create({
        data: {
          userProfileId: userProfileId,
          elevenLabsVoiceId: elevenLabsVoiceId,
          status: status,
          sharedPublicly: sharedPublicly,
          name: name,
          slideshowSettings: slideshowSettings,
          videoSettings: videoSettings
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
      return await prisma.generationsSettings.delete({
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
          sharedPublicly: boolean | undefined = undefined,
          name: string | undefined = undefined) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query
    try {
      return await prisma.generationsSettings.findMany({
        where: {
          userProfileId: userProfileId,
          elevenLabsVoiceId: elevenLabsVoiceId,
          status: status,
          sharedPublicly: sharedPublicly,
          name: name
        }
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
      return await prisma.generationsSettings.findMany({
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
    var generationsSettings: any = null

    try {
      generationsSettings = await prisma.generationsSettings.findUnique({
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
    return generationsSettings
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
    var generationsSettings: any = null

    try {
      generationsSettings = await prisma.generationsSettings.findFirst({
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
    return generationsSettings
  }

  async update(
          prisma: PrismaClient,
          id: string,
          userProfileId: string | undefined,
          elevenLabsVoiceId: string | null | undefined,
          status: string | undefined,
          sharedPublicly: boolean | undefined,
          name: string | undefined,
          slideshowSettings: any,
          videoSettings: any) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.generationsSettings.update({
        data: {
          userProfileId: userProfileId,
          elevenLabsVoiceId: elevenLabsVoiceId,
          status: status,
          sharedPublicly: sharedPublicly,
          name: name,
          slideshowSettings: slideshowSettings,
          videoSettings: videoSettings
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

  async upsert(
          prisma: PrismaClient,
          id: string | undefined,
          userProfileId: string | undefined,
          elevenLabsVoiceId: string | null | undefined,
          status: string | undefined,
          sharedPublicly: boolean | undefined,
          name: string | undefined,
          slideshowSettings: any,
          videoSettings: any) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    console.log(`${fnName}: starting with id: ` + JSON.stringify(id))

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        userProfileId != null &&
        name != null) {

      const generationsSettings = await
              this.getByUniqueKey(
                prisma,
                userProfileId,
                name)

      if (generationsSettings != null) {
        id = generationsSettings.id
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

      if (sharedPublicly == null) {
        console.error(`${fnName}: id is null and sharedPublicly is null`)
        throw 'Prisma error'
      }

      if (name == null) {
        console.error(`${fnName}: id is null and name is null`)
        throw 'Prisma error'
      }

      if (slideshowSettings === undefined) {
        console.error(`${fnName}: id is null and slideshowSettings is undefined`)
        throw 'Prisma error'
      }

      if (videoSettings === undefined) {
        console.error(`${fnName}: id is null and videoSettings is undefined`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 userProfileId,
                 elevenLabsVoiceId,
                 status,
                 sharedPublicly,
                 name,
                 slideshowSettings,
                 videoSettings)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 userProfileId,
                 elevenLabsVoiceId,
                 status,
                 sharedPublicly,
                 name,
                 slideshowSettings,
                 videoSettings)
    }
  }
}
