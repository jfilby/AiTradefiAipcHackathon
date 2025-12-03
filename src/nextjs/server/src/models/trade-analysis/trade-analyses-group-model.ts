import { PrismaClient } from '@prisma/client'
import { BaseDataTypes } from '@/shared/types/base-data-types'

export class TradeAnalysisGroupModel {

  // Consts
  clName = 'TradeAnalysisGroupModel'

  // Code
  async create(
          prisma: PrismaClient,
          analysisId: string,
          day: Date,
          engineVersion: string,
          status: string) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.tradeAnalysesGroup.create({
        data: {
          analysisId: analysisId,
          day: day,
          engineVersion: engineVersion,
          status: status
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
      return await prisma.tradeAnalysesGroup.delete({
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
          day: Date | undefined = undefined,
          status: string | undefined = undefined) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query
    try {
      return await prisma.tradeAnalysesGroup.findMany({
        where: {
          analysisId: analysisId,
          day: day,
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
    var tradeAnalysesGroup: any = null

    try {
      tradeAnalysesGroup = await prisma.tradeAnalysesGroup.findUnique({
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
    return tradeAnalysesGroup
  }

  async getByUniqueKey(
          prisma: PrismaClient,
          analysisId: string,
          day: Date) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Validate
    if (analysisId == null) {
      console.error(`${fnName}: analysisId == null`)
      throw 'Validation error'
    }

    if (day == null) {
      console.error(`${fnName}: day == null`)
      throw 'Validation error'
    }

    // Query
    var tradeAnalysesGroup: any = null

    try {
      tradeAnalysesGroup = await prisma.tradeAnalysesGroup.findFirst({
        where: {
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
    return tradeAnalysesGroup
  }

  async getLatest(
          prisma: PrismaClient,
          instrumentType: string | undefined,
          limitBy: number = 100) {

    // Debug
    const fnName = `${this.clName}.getLatest()`

    // Query
    try {
      return await prisma.tradeAnalysesGroup.findMany({
        take: limitBy,
        include: {
          analysis: true,
          ofTradeAnalyses: {
            include: {
              instrument: {
                include: {
                  exchange: true
                }
              }
            },
            orderBy: [
              {
                score: 'desc'
              }
            ]
          }
        },
        where: {
          ofTradeAnalyses: {
            some: {
              instrument: {
                status: BaseDataTypes.activeStatus,
                type: instrumentType
              },
              tradeType: 'B',
              score: {
                gte: 0.75
              }
            }
          }
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }
  }

  async update(
          prisma: PrismaClient,
          id: string,
          analysisId: string | undefined,
          day: Date | undefined,
          engineVersion: string | undefined,
          status: string | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.tradeAnalysesGroup.update({
        data: {
          analysisId: analysisId,
          day: day,
          engineVersion: engineVersion,
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
          analysisId: string | undefined,
          day: Date | undefined,
          engineVersion: string | undefined,
          status: string | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        analysisId != null &&
        day != null) {

      const tradeAnalysesGroup = await
              this.getByUniqueKey(
                prisma,
                analysisId,
                day)

      if (tradeAnalysesGroup != null) {
        id = tradeAnalysesGroup.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (analysisId == null) {
        console.error(`${fnName}: id is null and analysisId is null`)
        throw 'Prisma error'
      }

      if (day == null) {
        console.error(`${fnName}: id is null and day is null`)
        throw 'Prisma error'
      }

      if (engineVersion == null) {
        console.error(`${fnName}: id is null and engineVersion is null`)
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
                 analysisId,
                 day,
                 engineVersion,
                 status)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 analysisId,
                 day,
                 engineVersion,
                 status)
    }
  }
}
