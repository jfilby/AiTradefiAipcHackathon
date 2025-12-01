import { PrismaClient } from '@prisma/client'

export class TradeAnalysisModel {

  // Consts
  clName = 'TradeAnalysisModel'

  // Code
  async create(
          prisma: PrismaClient,
          instrumentId: string,
          analysisId: string,
          day: Date,
          status: string,
          tradeType: string,
          score: number) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.tradeAnalysis.create({
        data: {
          instrumentId: instrumentId,
          analysisId: analysisId,
          day: day,
          status: status,
          tradeType: tradeType,
          score: score
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
      return await prisma.tradeAnalysis.delete({
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
          instrumentId: string | undefined = undefined,
          analysisId: string | undefined = undefined,
          day: Date | undefined = undefined,
          status: string | undefined = undefined,
          tradeType: string | undefined = undefined) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query
    try {
      return await prisma.tradeAnalysis.findMany({
        where: {
          instrumentId: instrumentId,
          analysisId: analysisId,
          day: day,
          status: status,
          tradeType: tradeType
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
    var tradeAnalysis: any = null

    try {
      tradeAnalysis = await prisma.tradeAnalysis.findUnique({
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
    return tradeAnalysis
  }

  async getByUniqueKey(
          prisma: PrismaClient,
          instrumentId: string,
          analysisId: string,
          day: Date) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Validate
    if (instrumentId == null) {
      console.error(`${fnName}: instrumentId == null`)
      throw 'Validation error'
    }

    if (analysisId == null) {
      console.error(`${fnName}: analysisId == null`)
      throw 'Validation error'
    }

    if (day == null) {
      console.error(`${fnName}: day == null`)
      throw 'Validation error'
    }

    // Query
    var tradeAnalysis: any = null

    try {
      tradeAnalysis = await prisma.tradeAnalysis.findFirst({
        where: {
          instrumentId: instrumentId,
          analysisId: analysisId,
          day: day
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return tradeAnalysis
  }

  async update(
          prisma: PrismaClient,
          id: string,
          instrumentId: string | undefined,
          analysisId: string | undefined,
          day: Date | undefined,
          status: string | undefined,
          tradeType: string | undefined,
          score: number | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.tradeAnalysis.update({
        data: {
          instrumentId: instrumentId,
          analysisId: analysisId,
          day: day,
          status: status,
          tradeType: tradeType,
          score: score
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
          instrumentId: string | undefined,
          analysisId: string | undefined,
          day: Date | undefined,
          status: string | undefined,
          tradeType: string | undefined,
          score: number | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        instrumentId != null &&
        analysisId != null &&
        day != null) {

      const tradeAnalysis = await
              this.getByUniqueKey(
                prisma,
                instrumentId,
                analysisId,
                day)

      if (tradeAnalysis != null) {
        id = tradeAnalysis.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (instrumentId == null) {
        console.error(`${fnName}: id is null and instrumentId is null`)
        throw 'Prisma error'
      }

      if (analysisId == null) {
        console.error(`${fnName}: id is null and analysisId is null`)
        throw 'Prisma error'
      }

      if (day == null) {
        console.error(`${fnName}: id is null and day is null`)
        throw 'Prisma error'
      }

      if (status == null) {
        console.error(`${fnName}: id is null and status is null`)
        throw 'Prisma error'
      }

      if (tradeType == null) {
        console.error(`${fnName}: id is null and tradeType is null`)
        throw 'Prisma error'
      }

      if (score == null) {
        console.error(`${fnName}: id is null and score is null`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 instrumentId,
                 analysisId,
                 day,
                 status,
                 tradeType,
                 score)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 instrumentId,
                 analysisId,
                 day,
                 status,
                 tradeType,
                 score)
    }
  }
}
