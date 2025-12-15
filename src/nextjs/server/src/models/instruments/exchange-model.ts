import { PrismaClient } from '@prisma/client'

export class ExchangeModel {

  // Consts
  clName = 'ExchangeModel'

  // Code
  async create(
          prisma: PrismaClient,
          name: string,
          region: string,
          currencyCode: string,
          instrumentTypes: string[],
          yahooFinanceSuffix: string | null) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.exchange.create({
        data: {
          name: name,
          region: region,
          currencyCode: currencyCode,
          instrumentTypes: instrumentTypes,
          yahooFinanceSuffix: yahooFinanceSuffix
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
      return await prisma.exchange.delete({
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
          region: string | undefined) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query
    try {
      return await prisma.exchange.findMany({
        where: {
          region: region
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
    var exchange: any = null

    try {
      exchange = await prisma.exchange.findUnique({
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
    return exchange
  }

  async getByRegionAndInstrumentType(
          prisma: PrismaClient,
          region: string | undefined,
          instrumentType: string) {

    // Debug
    const fnName = `${this.clName}.getByInstrumentType()`

    // Validate
    if (instrumentType == null) {
      console.error(`${fnName}: instrumentType == null`)
      throw 'Validation error'
    }

    // Query
    try {
      return await prisma.exchange.findMany({
        where: {
          region: region,
          instrumentTypes: {
            has: instrumentType
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

  async getByUniqueKey(
          prisma: PrismaClient,
          name: string) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Validate
    if (name == null) {
      console.error(`${fnName}: name == null`)
      throw 'Validation error'
    }

    // Query
    var exchange: any = null

    try {
      exchange = await prisma.exchange.findFirst({
        where: {
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
    return exchange
  }

  async update(
          prisma: PrismaClient,
          id: string,
          name: string | undefined,
          region: string | undefined,
          currencyCode: string | undefined,
          instrumentTypes: string[] | undefined,
          yahooFinanceSuffix: string | null | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.exchange.update({
        data: {
          name: name,
          region: region,
          currencyCode: currencyCode,
          instrumentTypes: instrumentTypes,
          yahooFinanceSuffix: yahooFinanceSuffix
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

  async upsert(prisma: PrismaClient,
               id: string | undefined,
               name: string | undefined,
               region: string | undefined,
               currencyCode: string | undefined,
               instrumentTypes: string[] | undefined,
               yahooFinanceSuffix: string | null | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        name != null) {

      const exchange = await
              this.getByUniqueKey(
                prisma,
                name)

      if (exchange != null) {
        id = exchange.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (name == null) {
        console.error(`${fnName}: id is null and name is null`)
        throw 'Prisma error'
      }

      if (region == null) {
        console.error(`${fnName}: id is null and region is null`)
        throw 'Prisma error'
      }

      if (currencyCode == null) {
        console.error(`${fnName}: id is null and currencyCode is null`)
        throw 'Prisma error'
      }

      if (instrumentTypes == null) {
        console.error(`${fnName}: id is null and instrumentTypes is null`)
        throw 'Prisma error'
      }

      if (yahooFinanceSuffix === undefined) {
        console.error(`${fnName}: id is null and yahooFinanceSuffix is undefined`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 name,
                 region,
                 currencyCode,
                 instrumentTypes,
                 yahooFinanceSuffix)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 name,
                 region,
                 currencyCode,
                 instrumentTypes,
                 yahooFinanceSuffix)
    }
  }
}
