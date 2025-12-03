import { PrismaClient } from '@prisma/client'

export class YFinanceQuoteModel {

  // Consts
  clName = 'YFinanceQuoteModel'

  // Code
  async create(
          prisma: PrismaClient,
          instrumentId: string,
          data: any) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.yFinanceQuote.create({
        data: {
          instrumentId: instrumentId,
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
      return await prisma.yFinanceQuote.delete({
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
          instrumentId: string | undefined = undefined) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query
    try {
      return await prisma.yFinanceQuote.findMany({
        where: {
          instrumentId: instrumentId
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
    var yFinanceQuote: any = null

    try {
      yFinanceQuote = await prisma.yFinanceQuote.findUnique({
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
    return yFinanceQuote
  }

  async getByUniqueKey(
          prisma: PrismaClient,
          instrumentId: string) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Validate
    if (instrumentId == null) {
      console.error(`${fnName}: instrumentId == null`)
      throw 'Validation error'
    }

    // Query
    var yFinanceQuote: any = null

    try {
      yFinanceQuote = await prisma.yFinanceQuote.findFirst({
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

    // Return
    return yFinanceQuote
  }

  async update(
          prisma: PrismaClient,
          id: string,
          instrumentId: string | undefined,
          data: any | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.yFinanceQuote.update({
        data: {
          instrumentId: instrumentId,
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
          data: any | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        instrumentId != null) {

      const yFinanceQuote = await
              this.getByUniqueKey(
                prisma,
                instrumentId)

      if (yFinanceQuote != null) {
        id = yFinanceQuote.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (instrumentId == null) {
        console.error(`${fnName}: id is null and instrumentId is null`)
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
                 data)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 instrumentId,
                 data)
    }
  }
}
