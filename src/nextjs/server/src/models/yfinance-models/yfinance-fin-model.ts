import { PrismaClient } from '@prisma/client'

export class YFinanceFinModel {

  // Consts
  clName = 'YFinanceFinModel'

  // Code
  async create(
          prisma: PrismaClient,
          instrumentId: string,
          type: string,
          period: Date,
          data: any) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.yFinanceFin.create({
        data: {
          instrumentId: instrumentId,
          type: type,
          period: period,
          data: data
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
      return await prisma.yFinanceFin.delete({
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

  async deleteByInstrumentId(
          prisma: PrismaClient,
          instrumentId: string) {

    // Debug
    const fnName = `${this.clName}.deleteById()`

    // Delete
    try {
      return await prisma.yFinanceFin.deleteMany({
        where: {
          instrumentId: instrumentId
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
          type: string | undefined = undefined) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query
    try {
      return await prisma.yFinanceFin.findMany({
        where: {
          instrumentId: instrumentId,
          type: type
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
    var yFinanceFin: any = null

    try {
      yFinanceFin = await prisma.yFinanceFin.findUnique({
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
    return yFinanceFin
  }

  async getByUniqueKey(
          prisma: PrismaClient,
          instrumentId: string,
          type: string,
          period: Date) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Validate
    if (instrumentId == null) {
      console.error(`${fnName}: instrumentId == null`)
      throw 'Validation error'
    }

    if (type == null) {
      console.error(`${fnName}: type == null`)
      throw 'Validation error'
    }

    if (period == null) {
      console.error(`${fnName}: period == null`)
      throw 'Validation error'
    }

    // Query
    var yFinanceFin: any = null

    try {
      yFinanceFin = await prisma.yFinanceFin.findFirst({
        where: {
          instrumentId: instrumentId,
          type: type,
          period: period
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return yFinanceFin
  }

  async getLatest(
          prisma: PrismaClient,
          instrumentId: string,
          type: string,
          limitBy: number = 3) {

    // Debug
    const fnName = `${this.clName}.getLatest()`

    // Query
    try {
      return await prisma.yFinanceFin.findMany({
        take: limitBy,
        where: {
          instrumentId: instrumentId,
          type: type
        },
        orderBy: [
          {
            period: 'desc'
          }
        ]
      })
    } catch(error: any) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async update(
          prisma: PrismaClient,
          id: string,
          instrumentId: string | undefined,
          type: string | undefined,
          period: Date | undefined,
          data: any | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.yFinanceFin.update({
        data: {
          instrumentId: instrumentId,
          type: type,
          period: period,
          data: data
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
          type: string | undefined,
          period: Date | undefined,
          data: any | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        instrumentId != null &&
        type != null &&
        period != null) {

      const yFinanceFin = await
              this.getByUniqueKey(
                prisma,
                instrumentId,
                type,
                period)

      if (yFinanceFin != null) {
        id = yFinanceFin.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (instrumentId == null) {
        console.error(`${fnName}: id is null and instrumentId is null`)
        throw 'Prisma error'
      }

      if (type == null) {
        console.error(`${fnName}: id is null and type is null`)
        throw 'Prisma error'
      }

      if (period == null) {
        console.error(`${fnName}: id is null and period is null`)
        throw 'Prisma error'
      }

      if (data == null) {
        console.error(`${fnName}: id is null and data is null`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 instrumentId,
                 type,
                 period,
                 data)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 instrumentId,
                 type,
                 period,
                 data)
    }
  }
}
