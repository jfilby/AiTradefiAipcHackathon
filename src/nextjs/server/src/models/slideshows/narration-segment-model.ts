import { PrismaClient } from '@prisma/client'

export class NarrationSegmentModel {

  // Consts
  clName = 'NarrationSegmentModel'

  // Code
  async create(
          prisma: PrismaClient,
          narrationId: string,
          generatedAudioId: string | null,
          sentenceIndex: number,
          segmentIndex: number,
          text: string,
          tone: string,
          pauseMsAfter: number | null) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.narrationSegment.create({
        data: {
          narrationId: narrationId,
          generatedAudioId: generatedAudioId,
          sentenceIndex: sentenceIndex,
          segmentIndex: segmentIndex,
          text: text,
          tone: tone,
          pauseMsAfter: pauseMsAfter
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
      return await prisma.narrationSegment.delete({
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
          narrationId: string | undefined = undefined,
          sentenceIndex: number | undefined = undefined,
          segmentIndex: number | undefined = undefined,
          text: string | undefined = undefined,
          tone: string | undefined = undefined) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query
    try {
      return await prisma.narrationSegment.findMany({
        where: {
          narrationId: narrationId,
          sentenceIndex: sentenceIndex,
          segmentIndex: segmentIndex,
          text: text,
          tone: tone
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
    var slide: any = null

    try {
      slide = await prisma.narrationSegment.findUnique({
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
    return slide
  }

  async getByNarrationId(
          prisma: PrismaClient,
          narrationId: string) {

    // Debug
    const fnName = `${this.clName}.getByNarrationId()`

    // Validate
    if (narrationId == null) {
      console.error(`${fnName}: narrationId == null`)
      throw 'Validation error'
    }

    // Query
    try {
      return await prisma.narrationSegment.findMany({
        where: {
          narrationId: narrationId
        },
        orderBy: [
          {
            sentenceIndex: 'asc'
          },
          {
            segmentIndex: 'asc'
          }
        ]
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }
  }

  async getByUniqueKey(
          prisma: PrismaClient,
          narrationId: string,
          sentenceIndex: number,
          segmentIndex: number) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Validate
    if (narrationId == null) {
      console.error(`${fnName}: narrationId == null`)
      throw 'Validation error'
    }

    if (sentenceIndex == null) {
      console.error(`${fnName}: sentenceIndex == null`)
      throw 'Validation error'
    }

    if (segmentIndex == null) {
      console.error(`${fnName}: segmentIndex == null`)
      throw 'Validation error'
    }

    // Query
    var slide: any = null

    try {
      slide = await prisma.narrationSegment.findFirst({
        where: {
          narrationId: narrationId,
          sentenceIndex: sentenceIndex,
          segmentIndex: segmentIndex
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return slide
  }

  async update(
          prisma: PrismaClient,
          id: string,
          narrationId: string | undefined,
          generatedAudioId: string | null | undefined = undefined,
          sentenceIndex: number | undefined = undefined,
          segmentIndex: number | undefined = undefined,
          text: string | undefined = undefined,
          tone: string | undefined = undefined,
          pauseMsAfter: number | null | undefined = undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.narrationSegment.update({
        data: {
          narrationId: narrationId,
          generatedAudioId: generatedAudioId,
          sentenceIndex: sentenceIndex,
          segmentIndex: segmentIndex,
          text: text,
          tone: tone,
          pauseMsAfter: pauseMsAfter
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
          narrationId: string | undefined,
          generatedAudioId: string | null | undefined,
          sentenceIndex: number | undefined,
          segmentIndex: number | undefined,
          text: string | undefined,
          tone: string | undefined,
          pauseMsAfter: number | null | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // console.log(`${fnName}: starting with id: ` + JSON.stringify(id))

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        narrationId != null &&
        sentenceIndex != null &&
        segmentIndex != null) {

      const narrationSegment = await
        this.getByUniqueKey(
          prisma,
          narrationId,
          sentenceIndex,
          segmentIndex)

      if (narrationSegment != null) {
        id = narrationSegment.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (narrationId == null) {
        console.error(`${fnName}: id is null and narrationId is null`)
        throw 'Prisma error'
      }

      if (generatedAudioId == null) {
        console.error(`${fnName}: id is null and generatedAudioId is null`)
        throw 'Prisma error'
      }

      if (sentenceIndex == null) {
        console.error(`${fnName}: id is null and sentenceIndex is null`)
        throw 'Prisma error'
      }

      if (segmentIndex == null) {
        console.error(`${fnName}: id is null and segmentIndex is null`)
        throw 'Prisma error'
      }

      if (text == null) {
        console.error(`${fnName}: id is null and text is null`)
        throw 'Prisma error'
      }

      if (tone == null) {
        console.error(`${fnName}: id is null and tone is null`)
        throw 'Prisma error'
      }

      if (pauseMsAfter === undefined) {
        console.error(`${fnName}: id is null and pauseMsAfter is undefined`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 narrationId,
                 generatedAudioId,
                 sentenceIndex,
                 segmentIndex,
                 text,
                 tone,
                 pauseMsAfter)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 narrationId,
                 generatedAudioId,
                 sentenceIndex,
                 segmentIndex,
                 text,
                 tone,
                 pauseMsAfter)
    }
  }
}
