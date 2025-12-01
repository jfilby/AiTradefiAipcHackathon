import { PrismaClient } from '@prisma/client'

export class DocSourceModel {

  // Consts
  clName = 'DocSourceModel'

  // Code
  async create(
          prisma: PrismaClient,
          name: string,
          description: string | null) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.docSource.create({
        data: {
          name: name,
          description: description
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
      return await prisma.docSource.delete({
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

  async filter(prisma: PrismaClient,) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query
    try {
      return await prisma.docSource.findMany({
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
    var docSource: any = null

    try {
      docSource = await prisma.docSource.findUnique({
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
    return docSource
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
    var docSource: any = null

    try {
      docSource = await prisma.docSource.findFirst({
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
    return docSource
  }

  async update(
          prisma: PrismaClient,
          id: string,
          name: string | undefined,
          description: string | null | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.docSource.update({
        data: {
          name: name,
          description: description
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
               description: string | null | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        name != null) {

      const docSource = await
              this.getByUniqueKey(
                prisma,
                name)

      if (docSource != null) {
        id = docSource.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (name == null) {
        console.error(`${fnName}: id is null and name is null`)
        throw 'Prisma error'
      }

      if (description === undefined) {
        console.error(`${fnName}: id is null and description is undefined`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 name,
                 description)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 name,
                 description)
    }
  }
}
