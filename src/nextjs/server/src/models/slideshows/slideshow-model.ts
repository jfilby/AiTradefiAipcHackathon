import { PrismaClient } from '@prisma/client'

export class SlideshowModel {

  // Consts
  clName = 'SlideshowModel'

  // Code
  async create(
          prisma: PrismaClient,
          tradeAnalysisId: string,
          status: string) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.slideshow.create({
        data: {
          tradeAnalysisId: tradeAnalysisId,
          status: status
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
      return await prisma.slideshow.delete({
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
          tradeAnalysisId: string | undefined = undefined,
          status: string | undefined = undefined) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query
    try {
      return await prisma.slideshow.findMany({
        where: {
          tradeAnalysisId: tradeAnalysisId,
          status: status
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
    var slideshow: any = null

    try {
      slideshow = await prisma.slideshow.findUnique({
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
    return slideshow
  }

  async getByUniqueKey(
          prisma: PrismaClient,
          tradeAnalysisId: string) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Validate
    if (tradeAnalysisId == null) {
      console.error(`${fnName}: tradeAnalysisId == null`)
      throw 'Validation error'
    }

    // Query
    var slideshow: any = null

    try {
      slideshow = await prisma.slideshow.findFirst({
        where: {
          tradeAnalysisId: tradeAnalysisId
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return slideshow
  }

  async update(
          prisma: PrismaClient,
          id: string,
          tradeAnalysisId: string | undefined,
          status: string | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.slideshow.update({
        data: {
          tradeAnalysisId: tradeAnalysisId,
          status: status
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
          tradeAnalysisId: string | undefined,
          status: string | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    console.log(`${fnName}: starting with id: ` + JSON.stringify(id))

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        tradeAnalysisId != null) {

      const slideshow = await
              this.getByUniqueKey(
                prisma,
                tradeAnalysisId)

      if (slideshow != null) {
        id = slideshow.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (tradeAnalysisId == null) {
        console.error(`${fnName}: id is null and tradeAnalysisId is null`)
        throw 'Prisma error'
      }

      if (status == null) {
        console.error(`${fnName}: id is null and status is null`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 tradeAnalysisId,
                 status)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 tradeAnalysisId,
                 status)
    }
  }
}
