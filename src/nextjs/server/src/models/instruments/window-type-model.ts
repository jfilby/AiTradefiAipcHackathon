import { PrismaClient } from '@prisma/client'

export class WindowTypeModel {

  // Consts
  clName = 'WindowTypeModel'

  // Code
  async create(
          prisma: PrismaClient,
          status: string,
          name: string,
          fromTimeUnit: string,
          fromTimeValue: number,
          toTimeUnit: string,
          toTimeValue: number) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.windowType.create({
        data: {
          status: status,
          name: name,
          fromTimeUnit: fromTimeUnit,
          fromTimeValue: fromTimeValue,
          toTimeUnit: toTimeUnit,
          toTimeValue: toTimeValue
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
      return await prisma.windowType.delete({
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

  async filter(prisma: PrismaClient) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query
    try {
      return await prisma.windowType.findMany({
        where: {
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
    var windowType: any = null

    try {
      windowType = await prisma.windowType.findUnique({
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
    return windowType
  }

  async getByUniqueKey(
          prisma: PrismaClient,
          name: string | undefined = undefined,
          fromTimeUnit: string | undefined = undefined,
          fromTimeValue: number | undefined = undefined,
          toTimeUnit: string | undefined = undefined,
          toTimeValue: number | undefined = undefined) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Get by name
    if (name != null) {

      // Query
      var windowType: any = null

      try {
        windowType = await prisma.windowType.findFirst({
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
    }

    // Get by time units and amounts
    if (fromTimeUnit != null &&
        fromTimeValue != null &&
        toTimeUnit != null &&
        toTimeValue != null) {

      // Query
      var windowType: any = null

      try {
        windowType = await prisma.windowType.findFirst({
          where: {
            fromTimeUnit: fromTimeUnit,
            fromTimeValue: fromTimeValue,
            toTimeUnit: toTimeUnit,
            toTimeValue: toTimeValue
          }
        })
      } catch(error: any) {
        if (!(error instanceof error.NotFound)) {
          console.error(`${fnName}: error: ${error}`)
          throw 'Prisma error'
        }
      }
    }

    // Return
    return windowType
  }

  async update(
          prisma: PrismaClient,
          id: string,
          status: string | undefined,
          name: string | undefined,
          fromTimeUnit: string | undefined,
          fromTimeValue: number | undefined,
          toTimeUnit: string | undefined,
          toTimeValue: number | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.windowType.update({
        data: {
          status: status,
          name: name,
          fromTimeUnit: fromTimeUnit,
          fromTimeValue: fromTimeValue,
          toTimeUnit: toTimeUnit,
          toTimeValue: toTimeValue
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
               status: string | undefined,
               name: string | undefined,
               fromTimeUnit: string | undefined,
               fromTimeValue: number | undefined,
               toTimeUnit: string | undefined,
               toTimeValue: number | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null) {

      const windowType = await
              this.getByUniqueKey(
                prisma,
                name,
                fromTimeUnit,
                fromTimeValue,
                toTimeUnit,
                toTimeValue)

      if (windowType != null) {
        id = windowType.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (status == null) {
        console.error(`${fnName}: id is null and status is null`)
        throw 'Prisma error'
      }

      if (name == null) {
        console.error(`${fnName}: id is null and name is null`)
        throw 'Prisma error'
      }

      if (fromTimeUnit == null) {
        console.error(`${fnName}: id is null and fromTimeUnit is null`)
        throw 'Prisma error'
      }

      if (fromTimeValue == null) {
        console.error(`${fnName}: id is null and fromTimeValue is null`)
        throw 'Prisma error'
      }

      if (toTimeUnit == null) {
        console.error(`${fnName}: id is null and toTimeUnit is null`)
        throw 'Prisma error'
      }

      if (toTimeValue == null) {
        console.error(`${fnName}: id is null and toTimeValue is null`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 status,
                 name,
                 fromTimeUnit,
                 fromTimeValue,
                 toTimeUnit,
                 toTimeValue)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 status,
                 name,
                 fromTimeUnit,
                 fromTimeValue,
                 toTimeUnit,
                 toTimeValue)
    }
  }
}
