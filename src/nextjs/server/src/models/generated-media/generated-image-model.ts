import { PrismaClient } from '@prisma/client'

export class GeneratedImageModel {

  // Consts
  clName = 'GeneratedImageModel'

  // Code
  async create(
          prisma: PrismaClient,
          status: string,
          model: string,
          uniqueHash: string,
          prompt: string,
          path: string | null) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.generatedImage.create({
        data: {
          status: status,
          model: model,
          uniqueHash: uniqueHash,
          prompt: prompt,
          path: path
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
      return await prisma.generatedImage.delete({
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
          status: string | undefined = undefined,
          model: string | undefined = undefined) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query
    try {
      return await prisma.generatedImage.findMany({
        where: {
          status: status,
          model: model
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
    var generatedImage: any = null

    try {
      generatedImage = await prisma.generatedImage.findUnique({
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
    return generatedImage
  }

  async getByUniqueKey(
          prisma: PrismaClient,
          status: string,
          model: string,
          uniqueHash: string,
          prompt: string) {

    // Debug
    const fnName = `${this.clName}.getById()`

    // Query
    var generatedImage: any = null

    try {
      generatedImage = await prisma.generatedImage.findFirst({
        where: {
          status: status,
          model: model,
          uniqueHash: uniqueHash,
          prompt: prompt
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return generatedImage
  }

  async update(
          prisma: PrismaClient,
          id: string,
          status: string | undefined,
          model: string | undefined,
          uniqueHash: string | undefined,
          prompt: string | undefined,
          path: string | null | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.generatedImage.update({
        data: {
          status: status,
          model: model,
          uniqueHash: uniqueHash,
          prompt: prompt,
          path: path
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
          model: string | undefined,
          uniqueHash: string | undefined,
          prompt: string | undefined,
          path: string | null | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // console.log(`${fnName}: starting with id: ` + JSON.stringify(id))

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        status != null &&
        model != null &&
        uniqueHash != null &&
        prompt != null) {

      const generatedImage = await
              this.getByUniqueKey(
                prisma,
                status,
                model,
                uniqueHash,
                prompt)

      if (generatedImage != null) {
        id = generatedImage.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (status == null) {
        console.error(`${fnName}: id is null and status is null`)
        throw 'Prisma error'
      }

      if (model == null) {
        console.error(`${fnName}: id is null and model is null`)
        throw 'Prisma error'
      }

      if (uniqueHash == null) {
        console.error(`${fnName}: id is null and uniqueHash is null`)
        throw 'Prisma error'
      }

      if (prompt == null) {
        console.error(`${fnName}: id is null and prompt is null`)
        throw 'Prisma error'
      }

      if (path === undefined) {
        console.error(`${fnName}: id is null and path is undefined`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 status,
                 model,
                 uniqueHash,
                 prompt,
                 path)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 status,
                 model,
                 uniqueHash,
                 prompt,
                 path)
    }
  }
}
