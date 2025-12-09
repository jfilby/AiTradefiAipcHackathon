import { PrismaClient } from '@prisma/client'

export class AnalysisModel {

  // Consts
  clName = 'AnalysisModel'

  // Code
  async create(
          prisma: PrismaClient,
          userProfileId: string,
          generationsSettingsId: string,
          type: string,
          status: string,
          instrumentType: string,
          defaultMinScore: number,
          name: string,
          version: string,
          description: string,
          prompt: string) {

    // Debug
    const fnName = `${this.clName}.create()`

    console.log(`${fnName}: starting..`)

    // Create record
    try {
      return await prisma.analysis.create({
        data: {
          userProfileId: userProfileId,
          generationsSettingsId: generationsSettingsId,
          type: type,
          status: status,
          instrumentType: instrumentType,
          defaultMinScore: defaultMinScore,
          name: name,
          version: version,
          description: description,
          prompt: prompt
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
      return await prisma.analysis.delete({
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
          generationsSettingsId: string | undefined = undefined,
          type: string | undefined = undefined,
          status: string | undefined = undefined,
          instrumentType: string | undefined = undefined,
          name: string | undefined = undefined,
          version: string | undefined = undefined) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query
    try {
      return await prisma.analysis.findMany({
        where: {
          userProfileId: userProfileId,
          generationsSettingsId: generationsSettingsId,
          type: type,
          status: status,
          instrumentType: instrumentType,
          name: name,
          version: version
        }
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
    var analysis: any = null

    try {
      analysis = await prisma.analysis.findUnique({
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
    return analysis
  }

  async getByUniqueKey(
          prisma: PrismaClient,
          userProfileId: string,
          name: string,
          version: string) {

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

    if (version == null) {
      console.error(`${fnName}: version == null`)
      throw 'Validation error'
    }

    // Query
    var analysis: any = null

    try {
      analysis = await prisma.analysis.findFirst({
        where: {
          userProfileId: userProfileId,
          name: name,
          version: version
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return analysis
  }

  async update(
          prisma: PrismaClient,
          id: string,
          userProfileId: string | undefined,
          generationsSettingsId: string | undefined,
          type: string | undefined,
          status: string | undefined,
          instrumentType: string | undefined,
          defaultMinScore: number | undefined,
          name: string | undefined,
          version: string | undefined,
          description: string | undefined,
          prompt: string | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.analysis.update({
        data: {
          userProfileId: userProfileId,
          generationsSettingsId: generationsSettingsId,
          type: type,
          status: status,
          instrumentType: instrumentType,
          defaultMinScore: defaultMinScore,
          name: name,
          version: version,
          description: description,
          prompt: prompt
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
          generationsSettingsId: string | undefined,
          type: string | undefined,
          status: string | undefined,
          instrumentType: string | undefined,
          defaultMinScore: number | undefined,
          name: string | undefined,
          version: string | undefined,
          description: string | undefined,
          prompt: string | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    console.log(`${fnName}: starting with id: ` + JSON.stringify(id))

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        userProfileId != null &&
        name != null &&
        version != null) {

      const analysis = await
              this.getByUniqueKey(
                prisma,
                userProfileId,
                name,
                version)

      if (analysis != null) {
        id = analysis.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (userProfileId == null) {
        console.error(`${fnName}: id is null and userProfileId is null`)
        throw 'Prisma error'
      }

      if (generationsSettingsId == null) {
        console.error(`${fnName}: id is null and generationsSettingsId is null`)
        throw 'Prisma error'
      }

      if (type == null) {
        console.error(`${fnName}: id is null and type is null`)
        throw 'Prisma error'
      }

      if (status == null) {
        console.error(`${fnName}: id is null and status is null`)
        throw 'Prisma error'
      }

      if (instrumentType == null) {
        console.error(`${fnName}: id is null and instrumentType is null`)
        throw 'Prisma error'
      }

      if (defaultMinScore == null) {
        console.error(`${fnName}: id is null and defaultMinScore is null`)
        throw 'Prisma error'
      }

      if (name == null) {
        console.error(`${fnName}: id is null and name is null`)
        throw 'Prisma error'
      }

      if (version == null) {
        console.error(`${fnName}: id is null and version is null`)
        throw 'Prisma error'
      }

      if (description == null) {
        console.error(`${fnName}: id is null and description is null`)
        throw 'Prisma error'
      }

      if (prompt == null) {
        console.error(`${fnName}: id is null and prompt is null`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 userProfileId,
                 generationsSettingsId,
                 type,
                 status,
                 instrumentType,
                 defaultMinScore,
                 name,
                 version,
                 description,
                 prompt)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 userProfileId,
                 generationsSettingsId,
                 type,
                 status,
                 instrumentType,
                 defaultMinScore,
                 name,
                 version,
                 description,
                 prompt)
    }
  }
}
