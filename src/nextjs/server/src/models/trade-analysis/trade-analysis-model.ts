import { PrismaClient } from '@prisma/client'

export class TradeAnalysisModel {

  // Consts
  clName = 'TradeAnalysisModel'

  // Code
  async create(
          prisma: PrismaClient,
          tradeAnalysesGroupId: string,
          instrumentId: string,
          techId: string,
          status: string,
          tradeType: string,
          score: number,
          thesis: string) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.tradeAnalysis.create({
        data: {
          tradeAnalysesGroupId: tradeAnalysesGroupId,
          instrumentId: instrumentId,
          techId: techId,
          status: status,
          tradeType: tradeType,
          score: score,
          thesis: thesis
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
          tradeAnalysesGroupId: string | undefined = undefined,
          instrumentId: string | undefined = undefined,
          techId: string | undefined = undefined,
          status: string | undefined = undefined,
          tradeType: string | undefined = undefined,
          includeInstrument: boolean = false) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query
    try {
      return await prisma.tradeAnalysis.findMany({
        include: {
          instrument: includeInstrument ? {
            include: {
              exchange: true
            }
          } : undefined
        },
        where: {
          tradeAnalysesGroupId: tradeAnalysesGroupId,
          instrumentId: instrumentId,
          techId: techId,
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
          tradeAnalysesGroupId: string,
          instrumentId: string,
          techId: string) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Validate
    if (tradeAnalysesGroupId == null) {
      console.error(`${fnName}: tradeAnalysesGroupId == null`)
      throw 'Validation error'
    }

    if (instrumentId == null) {
      console.error(`${fnName}: instrumentId == null`)
      throw 'Validation error'
    }

    if (techId == null) {
      console.error(`${fnName}: techId == null`)
      throw 'Validation error'
    }

    // Query
    var tradeAnalysis: any = null

    try {
      tradeAnalysis = await prisma.tradeAnalysis.findFirst({
        where: {
          tradeAnalysesGroupId: tradeAnalysesGroupId,
          instrumentId: instrumentId,
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
    return tradeAnalysis
  }

  async update(
          prisma: PrismaClient,
          id: string,
          tradeAnalysesGroupId: string | undefined,
          instrumentId: string | undefined,
          techId: string | undefined,
          status: string | undefined,
          tradeType: string | undefined,
          score: number | undefined,
          thesis: string | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.tradeAnalysis.update({
        data: {
          tradeAnalysesGroupId: tradeAnalysesGroupId,
          instrumentId: instrumentId,
          techId: techId,
          status: status,
          tradeType: tradeType,
          score: score,
          thesis: thesis
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
          tradeAnalysesGroupId: string | undefined,
          instrumentId: string | undefined,
          analysisId: string | undefined,
          techId: string | undefined,
          day: Date | undefined,
          engineVersion: string | undefined,
          status: string | undefined,
          tradeType: string | undefined,
          score: number | undefined,
          thesis: string | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        tradeAnalysesGroupId != null &&
        instrumentId != null &&
        techId != null) {

      const tradeAnalysis = await
              this.getByUniqueKey(
                prisma,
                tradeAnalysesGroupId,
                instrumentId,
                techId)

      if (tradeAnalysis != null) {
        id = tradeAnalysis.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (tradeAnalysesGroupId == null) {
        console.error(`${fnName}: id is null and tradeAnalysesGroupId is null`)
        throw 'Prisma error'
      }

      if (instrumentId == null) {
        console.error(`${fnName}: id is null and instrumentId is null`)
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

      if (tradeType == null) {
        console.error(`${fnName}: id is null and tradeType is null`)
        throw 'Prisma error'
      }

      if (score == null) {
        console.error(`${fnName}: id is null and score is null`)
        throw 'Prisma error'
      }

      if (thesis == null) {
        console.error(`${fnName}: id is null and thesis is null`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 tradeAnalysesGroupId,
                 instrumentId,
                 techId,
                 status,
                 tradeType,
                 score,
                 thesis)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 tradeAnalysesGroupId,
                 instrumentId,
                 techId,
                 status,
                 tradeType,
                 score,
                 thesis)
    }
  }
}
