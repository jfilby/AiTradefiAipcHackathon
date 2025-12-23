import { PrismaClient } from '@prisma/client'

export class NarrationModel {

  // Consts
  clName = 'NarrationModel'

  // Code
  async create(
          prisma: PrismaClient,
          status: string,
          uniqueRef: string | null) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.narration.create({
        data: {
          status: status,
          uniqueRef: uniqueRef
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
      return await prisma.narration.delete({
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
          status: string | undefined = undefined) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query
    try {
      return await prisma.narration.findMany({
        where: {
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
    var narration: any = null

    try {
      narration = await prisma.narration.findUnique({
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
    return narration
  }

  async getByUniqueRef(
          prisma: PrismaClient,
          uniqueRef: string) {

    // Debug
    const fnName = `${this.clName}.getByUniqueRef()`

    // Query
    var narration: any = null

    try {
      narration = await prisma.narration.findUnique({
        where: {
          uniqueRef: uniqueRef
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return narration
  }

  async update(
          prisma: PrismaClient,
          id: string,
          status: string | undefined,
          uniqueRef: string | null | undefined = undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.narration.update({
        data: {
          status: status,
          uniqueRef: uniqueRef
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
          status: string | undefined,
          uniqueRef: string | null | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // console.log(`${fnName}: starting with id: ` + JSON.stringify(id))

    // If id isn't specified, but the unique ref is, try to get the record
    if (id == null &&
        uniqueRef != null) {

      const narration = await
        this.getByUniqueRef(
          prisma,
          uniqueRef)

      if (narration != null) {
        id = narration.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (status == null) {
        console.error(`${fnName}: id is null and status is null`)
        throw 'Prisma error'
      }

      if (uniqueRef === undefined) {
        console.error(`${fnName}: id is null and uniqueRef is undefined`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 status,
                 uniqueRef)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 status,
                 uniqueRef)
    }
  }
}
