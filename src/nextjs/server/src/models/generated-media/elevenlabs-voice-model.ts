import { PrismaClient } from '@prisma/client'
import { BaseDataTypes } from '@/shared/types/base-data-types'

export class ElevenLabsVoiceModel {

  // Consts
  clName = 'ElevenLabsVoiceModel'

  // Code
  async create(
          prisma: PrismaClient,
          voiceId: string,
          status: string,
          name: string,
          category: string,
          description: string,
          previewUrl: string,
          highQualityBaseModelIds: any) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.elevenLabsVoice.create({
        data: {
          voiceId: voiceId,
          status: status,
          name: name,
          category: category,
          description: description,
          previewUrl: previewUrl,
          highQualityBaseModelIds: highQualityBaseModelIds
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
      return await prisma.elevenLabsVoice.delete({
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
          voiceId: string | undefined = undefined,
          status: string | undefined = undefined,
          name: string | undefined = undefined,
          category: string | undefined = undefined) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query
    try {
      return await prisma.elevenLabsVoice.findMany({
        where: {
          voiceId: voiceId,
          status: status,
          name: name,
          category: category
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
    var elevenLabsVoice: any = null

    try {
      elevenLabsVoice = await prisma.elevenLabsVoice.findUnique({
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
    return elevenLabsVoice
  }

  async getByName(
          prisma: PrismaClient,
          name: string) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Validate
    if (name == null) {
      console.error(`${fnName}: id is null and name is null`)
      throw 'Prisma error'
    }

    // Query
    var elevenLabsVoice: any = null

    try {
      elevenLabsVoice = await prisma.elevenLabsVoice.findFirst({
        where: {
          status: BaseDataTypes.activeStatus,
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
    return elevenLabsVoice
  }

  async getByUniqueKey(
          prisma: PrismaClient,
          voiceId: string) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Validate
    if (voiceId == null) {
      console.error(`${fnName}: id is null and voiceId is null`)
      throw 'Prisma error'
    }

    // Query
    var elevenLabsVoice: any = null

    try {
      elevenLabsVoice = await prisma.elevenLabsVoice.findFirst({
        where: {
          voiceId: voiceId
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return elevenLabsVoice
  }

  async update(
          prisma: PrismaClient,
          id: string,
          voiceId: string | undefined,
          status: string | undefined,
          name: string | undefined,
          category: string | undefined,
          description: string | undefined,
          previewUrl: string | undefined,
          highQualityBaseModelIds: any) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.elevenLabsVoice.update({
        data: {
          voiceId: voiceId,
          status: status,
          name: name,
          category: category,
          description: description,
          previewUrl: previewUrl,
          highQualityBaseModelIds: highQualityBaseModelIds
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
          voiceId: string | undefined,
          status: string | undefined,
          name: string | undefined,
          category: string | undefined,
          description: string | undefined,
          previewUrl: string | undefined,
          highQualityBaseModelIds: any) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // console.log(`${fnName}: starting with id: ` + JSON.stringify(id))

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        voiceId != null) {

      const elevenLabsVoice = await
              this.getByUniqueKey(
                prisma,
                voiceId)

      if (elevenLabsVoice != null) {
        id = elevenLabsVoice.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (voiceId == null) {
        console.error(`${fnName}: id is null and voiceId is null`)
        throw 'Prisma error'
      }

      if (status == null) {
        console.error(`${fnName}: id is null and status is null`)
        throw 'Prisma error'
      }

      if (name == null) {
        console.error(`${fnName}: id is null and name is null`)
        throw 'Prisma error'
      }

      if (category == null) {
        console.error(`${fnName}: id is null and category is null`)
        throw 'Prisma error'
      }

      if (description == null) {
        console.error(`${fnName}: id is null and description is null`)
        throw 'Prisma error'
      }

      if (previewUrl == null) {
        console.error(`${fnName}: id is null and previewUrl is null`)
        throw 'Prisma error'
      }

      if (highQualityBaseModelIds == null) {
        console.error(`${fnName}: id is null and highQualityBaseModelIds is null`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 voiceId,
                 status,
                 name,
                 category,
                 description,
                 previewUrl,
                 highQualityBaseModelIds)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 voiceId,
                 status,
                 name,
                 category,
                 description,
                 previewUrl,
                 highQualityBaseModelIds)
    }
  }
}
