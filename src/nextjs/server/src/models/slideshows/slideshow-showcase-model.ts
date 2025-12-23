import { PrismaClient } from '@prisma/client'

export class SlideshowShowcaseModel {

  // Consts
  clName = 'SlideshowShowcaseModel'

  // Code
  async create(
          prisma: PrismaClient,
          slideshowId: string) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.slideshowShowcase.create({
        data: {
          slideshowId: slideshowId
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
      return await prisma.slideshowShowcase.delete({
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
      return await prisma.slideshowShowcase.findMany({
        where: {}
      })
    } catch(error: any) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async getByUniqueKey(
          prisma: PrismaClient,
          slideshowId: string) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Validate
    if (slideshowId == null) {
      console.error(`${fnName}: slideshowId == null`)
      throw 'Validation error'
    }

    // Query
    var slideshowShowcase: any = null

    try {
      slideshowShowcase = await prisma.slideshowShowcase.findFirst({
        where: {
          slideshowId: slideshowId
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return slideshowShowcase
  }

  async update(
          prisma: PrismaClient,
          id: string,
          slideshowId: string | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.slideshowShowcase.update({
        data: {
          slideshowId: slideshowId
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
          slideshowId: string | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    console.log(`${fnName}: starting with id: ` + JSON.stringify(id))

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        slideshowId != null) {

      const slideshowShowcase = await
              this.getByUniqueKey(
                prisma,
                slideshowId)

      if (slideshowShowcase != null) {
        id = slideshowShowcase.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (slideshowId == null) {
        console.error(`${fnName}: id is null and slideshowId is null`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 slideshowId)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 slideshowId)
    }
  }
}
