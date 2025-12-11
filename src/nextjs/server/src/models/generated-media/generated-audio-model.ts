import { PrismaClient } from '@prisma/client'

export class GeneratedAudioModel {

  // Consts
  clName = 'GeneratedAudioModel'

  // Code
  async create(
          prisma: PrismaClient,
          status: string,
          voice: string,
          quality: string,
          uniqueHash: string,
          prompt: string,
          path: string | null) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.generatedAudio.create({
        data: {
          status: status,
          voice: voice,
          quality: quality,
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
      return await prisma.generatedAudio.delete({
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
          voice: string | undefined = undefined,
          quality: string | undefined = undefined) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query
    try {
      return await prisma.generatedAudio.findMany({
        where: {
          status: status,
          voice: voice,
          quality: quality
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
    var generatedAudio: any = null

    try {
      generatedAudio = await prisma.generatedAudio.findUnique({
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
    return generatedAudio
  }

  async getByUniqueKey(
          prisma: PrismaClient,
          status: string,
          voice: string,
          quality: string,
          uniqueHash: string,
          prompt: string) {

    // Debug
    const fnName = `${this.clName}.getById()`

    // Query
    var generatedAudio: any = null

    try {
      generatedAudio = await prisma.generatedAudio.findFirst({
        where: {
          status: status,
          voice: voice,
          quality: quality,
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
    return generatedAudio
  }

  async update(
          prisma: PrismaClient,
          id: string,
          status: string | undefined,
          voice: string | undefined,
          quality: string | undefined,
          uniqueHash: string | undefined,
          prompt: string | undefined,
          path: string | null | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.generatedAudio.update({
        data: {
          status: status,
          voice: voice,
          quality: quality,
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
          voice: string | undefined,
          quality: string | undefined,
          uniqueHash: string | undefined,
          prompt: string | undefined,
          path: string | null | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // console.log(`${fnName}: starting with id: ` + JSON.stringify(id))

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        status != null &&
        voice != null &&
        quality != null &&
        uniqueHash != null &&
        prompt != null) {

      const generatedAudio = await
              this.getByUniqueKey(
                prisma,
                status,
                voice,
                quality,
                uniqueHash,
                prompt)

      if (generatedAudio != null) {
        id = generatedAudio.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (status == null) {
        console.error(`${fnName}: id is null and status is null`)
        throw 'Prisma error'
      }

      if (voice == null) {
        console.error(`${fnName}: id is null and voice is null`)
        throw 'Prisma error'
      }

      if (quality == null) {
        console.error(`${fnName}: id is null and quality is null`)
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
                 voice,
                 quality,
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
                 voice,
                 quality,
                 uniqueHash,
                 prompt,
                 path)
    }
  }
}
