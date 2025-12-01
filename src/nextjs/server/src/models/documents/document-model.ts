import { PrismaClient } from '@prisma/client'

export class DocumentModel {

  // Consts
  clName = 'DocumentModel'

  // Code
  async create(
          prisma: PrismaClient,
          docSourceId: string,
          uniqueRef: string,
          headline: string,
          originalSource: string | null,
          originalUrl: string | null,
          text: string,
          instruments: string[],
          published: Date) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.document.create({
        data: {
          docSourceId: docSourceId,
          uniqueRef: uniqueRef,
          headline: headline,
          originalSource: originalSource,
          originalUrl: originalUrl,
          text: text,
          instruments: instruments,
          published: published
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
      return await prisma.document.delete({
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
          docSourceId: string | undefined,
          published: Date | undefined = undefined) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query
    try {
      return await prisma.document.findMany({
        where: {
          docSourceId: docSourceId,
          published: published ? {
            gte: published
          } : undefined
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
    var document: any = null

    try {
      document = await prisma.document.findUnique({
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
    return document
  }

  async getByUniqueKey(
          prisma: PrismaClient,
          docSourceId: string,
          uniqueRef: string) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Validate
    if (docSourceId == null) {
      console.error(`${fnName}: docSourceId == null`)
      throw 'Validation error'
    }

    if (uniqueRef == null) {
      console.error(`${fnName}: uniqueRef == null`)
      throw 'Validation error'
    }

    // Query
    var document: any = null

    try {
      document = await prisma.document.findFirst({
        where: {
          docSourceId: docSourceId,
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
    return document
  }

  async update(
          prisma: PrismaClient,
          id: string,
          docSourceId: string | undefined,
          uniqueRef: string | undefined,
          headline: string | undefined,
          originalSource: string | null | undefined,
          originalUrl: string | null | undefined,
          text: string | undefined,
          instruments: string[] | undefined,
          published: Date | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.document.update({
        data: {
          docSourceId: docSourceId,
          uniqueRef: uniqueRef,
          headline: headline,
          originalSource: originalSource,
          originalUrl: originalUrl,
          text: text,
          instruments: instruments,
          published: published
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
               docSourceId: string | undefined,
               uniqueRef: string | undefined,
               headline: string | undefined,
               originalSource: string | null | undefined,
               originalUrl: string | null | undefined,
               text: string | undefined,
               instruments: string[] | undefined,
               published: Date | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        docSourceId != null &&
        uniqueRef != null) {

      const document = await
              this.getByUniqueKey(
                prisma,
                docSourceId,
                uniqueRef)

      if (document != null) {
        id = document.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (docSourceId == null) {
        console.error(`${fnName}: id is null and docSourceId is null`)
        throw 'Prisma error'
      }

      if (uniqueRef == null) {
        console.error(`${fnName}: id is null and uniqueRef is null`)
        throw 'Prisma error'
      }

      if (headline == null) {
        console.error(`${fnName}: id is null and headline is null`)
        throw 'Prisma error'
      }

      if (originalSource === undefined) {
        console.error(`${fnName}: id is null and originalSource is undefined`)
        throw 'Prisma error'
      }

      if (originalUrl === undefined) {
        console.error(`${fnName}: id is null and originalUrl is undefined`)
        throw 'Prisma error'
      }

      if (text == null) {
        console.error(`${fnName}: id is null and text is null`)
        throw 'Prisma error'
      }

      if (instruments == null) {
        console.error(`${fnName}: id is null and instruments is null`)
        throw 'Prisma error'
      }

      if (published == null) {
        console.error(`${fnName}: id is null and published is null`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 docSourceId,
                 uniqueRef,
                 headline,
                 originalSource,
                 originalUrl,
                 text,
                 instruments,
                 published)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 docSourceId,
                 uniqueRef,
                 headline,
                 originalSource,
                 originalUrl,
                 text,
                 instruments,
                 published)
    }
  }
}
