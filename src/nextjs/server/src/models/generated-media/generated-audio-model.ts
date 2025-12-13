import { PrismaClient } from '@prisma/client'

export class GeneratedAudioModel {

  // Consts
  clName = 'GeneratedAudioModel'

  // Code
  async create(
          prisma: PrismaClient,
          status: string,
          elevenLabsVoiceId: string,
          outputFormat: string,
          prompt: string,
          relativePath: string) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.generatedAudio.create({
        data: {
          status: status,
          elevenLabsVoiceId: elevenLabsVoiceId,
          outputFormat: outputFormat,
          prompt: prompt,
          relativePath: relativePath
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
          elevenLabsVoiceId: string | undefined = undefined,
          outputFormat: string | undefined = undefined) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query
    try {
      return await prisma.generatedAudio.findMany({
        where: {
          status: status,
          elevenLabsVoiceId: elevenLabsVoiceId,
          outputFormat: outputFormat
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
          relativePath: string) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Validate
    if (relativePath === undefined) {
      console.error(`${fnName}: id is null and relativePath is undefined`)
      throw 'Prisma error'
    }

    // Query
    var generatedAudio: any = null

    try {
      generatedAudio = await prisma.generatedAudio.findFirst({
        where: {
          relativePath: relativePath
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
          elevenLabsVoiceId: string | undefined,
          outputFormat: string | undefined,
          prompt: string | undefined,
          relativePath: string | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.generatedAudio.update({
        data: {
          status: status,
          elevenLabsVoiceId: elevenLabsVoiceId,
          outputFormat: outputFormat,
          prompt: prompt,
          relativePath: relativePath
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
          elevenLabsVoiceId: string | undefined,
          outputFormat: string | undefined,
          prompt: string | undefined,
          relativePath: string | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // console.log(`${fnName}: starting with id: ` + JSON.stringify(id))

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        relativePath != null) {

      const generatedAudio = await
              this.getByUniqueKey(
                prisma,
                relativePath)

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

      if (elevenLabsVoiceId == null) {
        console.error(`${fnName}: id is null and elevenLabsVoiceId is null`)
        throw 'Prisma error'
      }

      if (outputFormat == null) {
        console.error(`${fnName}: id is null and outputFormat is null`)
        throw 'Prisma error'
      }

      if (prompt == null) {
        console.error(`${fnName}: id is null and prompt is null`)
        throw 'Prisma error'
      }

      if (relativePath === undefined) {
        console.error(`${fnName}: id is null and relativePath is undefined`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 status,
                 elevenLabsVoiceId,
                 outputFormat,
                 prompt,
                 relativePath)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 status,
                 elevenLabsVoiceId,
                 outputFormat,
                 prompt,
                 relativePath)
    }
  }
}
