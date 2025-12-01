import { PrismaClient } from '@prisma/client'

export class AnalysisModel {

  // Consts
  clName = 'AnalysisModel'

  // Code
  async create(
          prisma: PrismaClient,
          status: string,
          name: string,
          version: string,
          prompt: string) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.analysis.create({
        data: {
          status: status,
          name: name,
          version: version,
          prompt: prompt
        }
      })
    } catch(error) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
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
          status: string | undefined = undefined,
          name: string | undefined = undefined,
          version: string | undefined = undefined) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query
    try {
      return await prisma.analysis.findMany({
        where: {
          status: status,
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
          name: string,
          version: string) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Validate
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
          status: string | undefined,
          name: string | undefined,
          version: string | undefined,
          prompt: string | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.analysis.update({
        data: {
          status: status,
          name: name,
          version: version,
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
          status: string | undefined,
          name: string | undefined,
          version: string | undefined,
          prompt: string | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        name != null &&
        version != null) {

      const analysis = await
              this.getByUniqueKey(
                prisma,
                name,
                version)

      if (analysis != null) {
        id = analysis.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (status == null) {
        console.error(`${fnName}: id is null and status is null`)
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

      if (prompt == null) {
        console.error(`${fnName}: id is null and prompt is null`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 status,
                 name,
                 version,
                 prompt)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 status,
                 name,
                 version,
                 prompt)
    }
  }
}
