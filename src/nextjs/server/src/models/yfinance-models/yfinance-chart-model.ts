import { PrismaClient } from '@prisma/client'

export class YFinanceChartModel {

  // Consts
  clName = 'YFinanceChartModel'

  // Code
  async create(
          prisma: PrismaClient,
          instrumentId: string,
          type: string,
          period1: Date,
          period2: Date,
          interval: string,
          data: any) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.yFinanceChart.create({
        data: {
          instrumentId: instrumentId,
          type: type,
          period1: period1,
          period2: period2,
          interval: interval,
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
      return await prisma.yFinanceChart.delete({
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
          type: string | undefined = undefined,
          interval: string | undefined = undefined) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query
    try {
      return await prisma.yFinanceChart.findMany({
        where: {
          instrumentId: instrumentId,
          type: type,
          interval: interval
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
    var yFinanceChart: any = null

    try {
      yFinanceChart = await prisma.yFinanceChart.findUnique({
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
    return yFinanceChart
  }

  async getByUniqueKey(
          prisma: PrismaClient,
          instrumentId: string,
          type: string,
          period1: Date,
          period2: Date,
          interval: string) {

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

    if (period1 == null) {
      console.error(`${fnName}: period1 == null`)
      throw 'Validation error'
    }

    if (period2 == null) {
      console.error(`${fnName}: period2 == null`)
      throw 'Validation error'
    }

    if (interval == null) {
      console.error(`${fnName}: interval == null`)
      throw 'Validation error'
    }

    // Query
    var yFinanceChart: any = null

    try {
      yFinanceChart = await prisma.yFinanceChart.findFirst({
        where: {
          instrumentId: instrumentId,
          type: type,
          period1: period1,
          period2: period2,
          interval: interval
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return yFinanceChart
  }

  async update(
          prisma: PrismaClient,
          id: string,
          instrumentId: string | undefined,
          type: string | undefined,
          period1: Date | undefined,
          period2: Date | undefined,
          interval: string | undefined,
          data: any | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.yFinanceChart.update({
        data: {
          instrumentId: instrumentId,
          type: type,
          period1: period1,
          period2: period2,
          interval: interval,
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
          period1: Date | undefined,
          period2: Date | undefined,
          interval: string | undefined,
          data: any | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        instrumentId != null &&
        type != null &&
        period1 != null &&
        period2 != null &&
        interval != null) {

      const yFinanceChart = await
              this.getByUniqueKey(
                prisma,
                instrumentId,
                type,
                period1,
                period2,
                interval)

      if (yFinanceChart != null) {
        id = yFinanceChart.id
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

      if (period1 == null) {
        console.error(`${fnName}: id is null and period1 is null`)
        throw 'Prisma error'
      }

      if (period2 == null) {
        console.error(`${fnName}: id is null and period2 is null`)
        throw 'Prisma error'
      }

      if (interval == null) {
        console.error(`${fnName}: id is null and interval is null`)
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
                 period1,
                 period2,
                 interval,
                 data)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 instrumentId,
                 type,
                 period1,
                 period2,
                 interval,
                 data)
    }
  }
}
