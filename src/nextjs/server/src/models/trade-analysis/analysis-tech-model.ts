import { PrismaClient } from '@prisma/client'

export class AnalysisTechModel {

  // Consts
  clName = 'AnalysisTechModel'

  // Code
  async create(
          prisma: PrismaClient,
          analysisId: string,
          techId: string,
          status: string,
          isLeaderTech: boolean) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.analysisTech.create({
        data: {
          analysisId: analysisId,
          techId: techId,
          status: status,
          isLeaderTech: isLeaderTech
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
      return await prisma.analysisTech.delete({
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
          analysisId: string | undefined = undefined,
          techId: string | undefined = undefined,
          status: string | undefined = undefined,
          isLeaderTech: boolean | undefined = undefined) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query
    try {
      return await prisma.analysisTech.findMany({
        where: {
          analysisId: analysisId,
          techId: techId,
          status: status,
          isLeaderTech: isLeaderTech
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
    var analysisTech: any = null

    try {
      analysisTech = await prisma.analysisTech.findUnique({
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
    return analysisTech
  }

  async getByUniqueKey(
          prisma: PrismaClient,
          analysisId: string,
          techId: string) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Validate
    if (analysisId == null) {
      console.error(`${fnName}: analysisId == null`)
      throw 'Validation error'
    }

    if (techId == null) {
      console.error(`${fnName}: techId == null`)
      throw 'Validation error'
    }

    // Query
    var analysisTech: any = null

    try {
      analysisTech = await prisma.analysisTech.findFirst({
        where: {
          analysisId: analysisId,
          techId: techId
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return analysisTech
  }

  async update(
          prisma: PrismaClient,
          id: string,
          analysisId: string | undefined,
          techId: string | undefined,
          status: string | undefined,
          isLeaderTech: boolean | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.analysisTech.update({
        data: {
          analysisId: analysisId,
          techId: techId,
          status: status,
          isLeaderTech: isLeaderTech
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
          analysisId: string | undefined,
          techId: string | undefined,
          status: string | undefined,
          isLeaderTech: boolean | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        analysisId != null &&
        techId != null) {

      const analysisTech = await
              this.getByUniqueKey(
                prisma,
                analysisId,
                techId)

      if (analysisTech != null) {
        id = analysisTech.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (analysisId == null) {
        console.error(`${fnName}: id is null and analysisId is null`)
        throw 'Prisma error'
      }

      if (techId == null) {
        console.error(`${fnName}: id is null and techId is null`)
        throw 'Prisma error'
      }

      if (status == null) {
        console.error(`${fnName}: id is null and status is null`)
        throw 'Prisma error'
      }

      if (isLeaderTech == null) {
        console.error(`${fnName}: id is null and isLeaderTech is null`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 analysisId,
                 techId,
                 status,
                 isLeaderTech)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 analysisId,
                 techId,
                 status,
                 isLeaderTech)
    }
  }
}
