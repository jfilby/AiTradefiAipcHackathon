import { PrismaClient } from '@prisma/client'

export class InstrumentModel {

  // Consts
  clName = 'InstrumentModel'

  // Code
  async create(
          prisma: PrismaClient,
          exchangeId: string,
          symbol: string,
          type: string,
          name: string) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.instrument.create({
        data: {
          exchangeId: exchangeId,
          symbol: symbol,
          type: type,
          name: name
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
      return await prisma.instrument.delete({
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
          exchangeId: string | undefined = undefined,
          type: string | undefined = undefined) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query
    try {
      return await prisma.instrument.findMany({
        where: {
          exchangeId: exchangeId,
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
    var instrument: any = null

    try {
      instrument = await prisma.instrument.findUnique({
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
    return instrument
  }

  async getByUniqueKey(
          prisma: PrismaClient,
          exchangeId: string,
          symbol: string) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Validate
    if (exchangeId == null) {
      console.error(`${fnName}: exchangeId == null`)
      throw 'Validation error'
    }

    if (symbol == null) {
      console.error(`${fnName}: symbol == null`)
      throw 'Validation error'
    }

    // Query
    var instrument: any = null

    try {
      instrument = await prisma.instrument.findFirst({
        where: {
          exchangeId: exchangeId,
          symbol: symbol
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return instrument
  }

  async update(
          prisma: PrismaClient,
          id: string,
          exchangeId: string | undefined,
          symbol: string | undefined,
          type: string | undefined,
          name: string | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.instrument.update({
        data: {
          exchangeId: exchangeId,
          symbol: symbol,
          type: type,
          name: name
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
               exchangeId: string | undefined,
               symbol: string | undefined,
               type: string | undefined,
               name: string | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        exchangeId != null &&
        symbol != null) {

      const instrument = await
              this.getByUniqueKey(
                prisma,
                exchangeId,
                symbol)

      if (instrument != null) {
        id = instrument.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (exchangeId == null) {
        console.error(`${fnName}: id is null and exchangeId is null`)
        throw 'Prisma error'
      }

      if (symbol == null) {
        console.error(`${fnName}: id is null and symbol is null`)
        throw 'Prisma error'
      }

      if (type == null) {
        console.error(`${fnName}: id is null and type is null`)
        throw 'Prisma error'
      }

      if (name == null) {
        console.error(`${fnName}: id is null and name is null`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 exchangeId,
                 symbol,
                 type,
                 name)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 exchangeId,
                 symbol,
                 type,
                 name)
    }
  }
}
