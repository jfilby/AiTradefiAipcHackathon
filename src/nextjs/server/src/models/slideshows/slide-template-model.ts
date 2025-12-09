import { PrismaClient } from '@prisma/client'

export class SlideTemplateModel {

  // Consts
  clName = 'SlideTemplateModel'

  // Code
  async existsByAnalysisId(
          prisma: PrismaClient,
          analysisId: string) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Validate
    if (analysisId == null) {
      console.error(`${fnName}: analysisId == null`)
      throw 'Validation error'
    }

    // Query
    var slideTemplate: any = null

    try {
      slideTemplate = await prisma.slideTemplate.findFirst({
        where: {
          analysisId: analysisId
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    if (slideTemplate != null) {
      return true
    } else {
      return false
    }
  }

  async create(
          prisma: PrismaClient,
          analysisId: string,
          slideNo: number,
          type: string,
          title: string,
          textPrompt: string | null,
          audioPrompt: string | null,
          imagePrompt: string | null) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.slideTemplate.create({
        data: {
          analysisId: analysisId,
          slideNo: slideNo,
          type: type,
          title: title,
          textPrompt: textPrompt,
          audioPrompt: audioPrompt,
          imagePrompt: imagePrompt
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
      return await prisma.slideTemplate.delete({
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
          analysisId: string | undefined = undefined,
          slideNo: number | undefined = undefined,
          type: string | undefined = undefined) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query
    try {
      return await prisma.slideTemplate.findMany({
        where: {
          analysisId: analysisId,
          slideNo: slideNo,
          type: type
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
    var slideTemplate: any = null

    try {
      slideTemplate = await prisma.slideTemplate.findUnique({
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
    return slideTemplate
  }

  async getByUniqueKey(
          prisma: PrismaClient,
          analysisId: string,
          slideNo: number) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Validate
    if (analysisId == null) {
      console.error(`${fnName}: analysisId == null`)
      throw 'Validation error'
    }

    if (slideNo == null) {
      console.error(`${fnName}: slideNo == null`)
      throw 'Validation error'
    }

    // Query
    var slideTemplate: any = null

    try {
      slideTemplate = await prisma.slideTemplate.findFirst({
        where: {
          analysisId: analysisId,
          slideNo: slideNo
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return slideTemplate
  }

  async update(
          prisma: PrismaClient,
          id: string,
          analysisId: string | undefined,
          slideNo: number | undefined,
          type: string | undefined,
          title: string | undefined,
          textPrompt: string | null | undefined,
          audioPrompt: string | null | undefined,
          imagePrompt: string | null | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.slideTemplate.update({
        data: {
          analysisId: analysisId,
          slideNo: slideNo,
          type: type,
          title: title,
          textPrompt: textPrompt,
          audioPrompt: audioPrompt,
          imagePrompt: imagePrompt
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
          analysisId: string | undefined,
          slideNo: number | undefined,
          type: string | undefined,
          title: string | undefined,
          textPrompt: string | null | undefined,
          audioPrompt: string | null | undefined,
          imagePrompt: string | null | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    console.log(`${fnName}: starting with id: ` + JSON.stringify(id))

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        analysisId != null &&
        slideNo != null) {

      const slideTemplate = await
              this.getByUniqueKey(
                prisma,
                analysisId,
                slideNo)

      if (slideTemplate != null) {
        id = slideTemplate.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (analysisId == null) {
        console.error(`${fnName}: id is null and analysisId is null`)
        throw 'Prisma error'
      }

      if (slideNo == null) {
        console.error(`${fnName}: id is null and slideNo is null`)
        throw 'Prisma error'
      }

      if (slideNo == null) {
        console.error(`${fnName}: id is null and slideNo is null`)
        throw 'Prisma error'
      }

      if (type == null) {
        console.error(`${fnName}: id is null and type is null`)
        throw 'Prisma error'
      }

      if (title == null) {
        console.error(`${fnName}: id is null and title is null`)
        throw 'Prisma error'
      }

      if (textPrompt === undefined) {
        console.error(`${fnName}: id is null and textPrompt is undefined`)
        throw 'Prisma error'
      }

      if (audioPrompt === undefined) {
        console.error(`${fnName}: id is null and audioPrompt is undefined`)
        throw 'Prisma error'
      }

      if (imagePrompt === undefined) {
        console.error(`${fnName}: id is null and imagePrompt is undefined`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 analysisId,
                 slideNo,
                 type,
                 title,
                 textPrompt,
                 audioPrompt,
                 imagePrompt)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 analysisId,
                 slideNo,
                 type,
                 title,
                 textPrompt,
                 audioPrompt,
                 imagePrompt)
    }
  }
}
