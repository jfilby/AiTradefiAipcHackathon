import { PrismaClient, Slide } from '@prisma/client'
import { BaseDataTypes } from '@/shared/types/base-data-types'

export class SlideModel {

  // Consts
  clName = 'SlideModel'

  // Code
  async create(
          prisma: PrismaClient,
          slideshowId: string,
          slideTemplateId: string,
          slideNo: number,
          status: string,
          title: string,
          text: string | null,
          narrationId: string | null,
          generatedImageId: string | null) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.slide.create({
        data: {
          slideshowId: slideshowId,
          slideTemplateId: slideTemplateId,
          slideNo: slideNo,
          status: status,
          title: title,
          text: text,
          narrationId: narrationId,
          generatedImageId: generatedImageId
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
      return await prisma.slide.delete({
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
          slideshowId: string | undefined = undefined,
          slideTemplateId: string | undefined = undefined,
          slideNo: number | undefined = undefined,
          status: string | undefined = undefined) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query
    try {
      return await prisma.slide.findMany({
        where: {
          slideshowId: slideshowId,
          slideTemplateId: slideTemplateId,
          slideNo: slideNo,
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
    var slide: any = null

    try {
      slide = await prisma.slide.findUnique({
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

  async getByUniqueKey1(
          prisma: PrismaClient,
          slideshowId: string,
          slideTemplateId: string) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey1()`

    // Validate
    if (slideshowId == null) {
      console.error(`${fnName}: slideshowId == null`)
      throw 'Validation error'
    }

    if (slideTemplateId == null) {
      console.error(`${fnName}: slideTemplateId == null`)
      throw 'Validation error'
    }

    // Query
    var slide: any = null

    try {
      slide = await prisma.slide.findFirst({
        where: {
          slideshowId: slideshowId,
          slideTemplateId: slideTemplateId
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

  async getByUniqueKey2(
          prisma: PrismaClient,
          slideshowId: string,
          slideNo: number) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey2()`

    // Validate
    if (slideshowId == null) {
      console.error(`${fnName}: slideshowId == null`)
      throw 'Validation error'
    }

    if (slideNo == null) {
      console.error(`${fnName}: slideNo == null`)
      throw 'Validation error'
    }

    // Query
    var slide: any = null

    try {
      slide = await prisma.slide.findFirst({
        where: {
          slideshowId: slideshowId,
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
    return slide
  }

  async getLastSlides(
          prisma: PrismaClient,
          slideshowId: string,
          limitBy: number = 1) {

    // Debug
    const fnName = `${this.clName}.getLastSlides()`

    // Validate
    if (slideshowId == null) {
      console.error(`${fnName}: slideshowId == null`)
      throw 'Validation error'
    }

    // Query
    try {
      return await prisma.slide.findMany({
        take: limitBy,
        where: {
          slideshowId: slideshowId,
          status: BaseDataTypes.activeStatus
        },
        orderBy: [
          {
            slideNo: 'desc'
          }
        ]
      })
    } catch(error: any) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async update(
          prisma: PrismaClient,
          id: string,
          slideshowId: string | undefined,
          slideTemplateId: string | undefined,
          slideNo: number | undefined,
          status: string | undefined,
          title: string | undefined,
          text: string | null | undefined,
          narrationId: string | null | undefined,
          generatedImageId: string | null | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.slide.update({
        data: {
          slideshowId: slideshowId,
          slideTemplateId: slideTemplateId,
          slideNo: slideNo,
          status: status,
          title: title,
          text: text,
          narrationId: narrationId,
          generatedImageId: generatedImageId
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
          slideshowId: string | undefined,
          slideTemplateId: string | undefined,
          slideNo: number | undefined,
          status: string | undefined,
          title: string | undefined,
          text: string | null | undefined,
          narrationId: string | null | undefined,
          generatedImageId: string | null | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // console.log(`${fnName}: starting with id: ` + JSON.stringify(id))

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null) {

      var slide: Slide | undefined = undefined

      if (slideshowId != null &&
          slideTemplateId != null) {

        slide = await
          this.getByUniqueKey1(
            prisma,
            slideshowId,
            slideTemplateId)

      } else if (slideshowId != null &&
                 slideNo != null) {

        slide = await
          this.getByUniqueKey2(
            prisma,
            slideshowId,
            slideNo)
      }

      if (slide != null) {
        id = slide.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (slideshowId == null) {
        console.error(`${fnName}: id is null and slideshowId is null`)
        throw 'Prisma error'
      }

      if (slideTemplateId == null) {
        console.error(`${fnName}: id is null and slideTemplateId is null`)
        throw 'Prisma error'
      }

      if (slideNo == null) {
        console.error(`${fnName}: id is null and slideNo is null`)
        throw 'Prisma error'
      }

      if (status == null) {
        console.error(`${fnName}: id is null and status is null`)
        throw 'Prisma error'
      }

      if (title == null) {
        console.error(`${fnName}: id is null and title is null`)
        throw 'Prisma error'
      }

      if (text === undefined) {
        console.error(`${fnName}: id is null and text is undefined`)
        throw 'Prisma error'
      }

      if (narrationId === undefined) {
        console.error(`${fnName}: id is null and narrationId is undefined`)
        throw 'Prisma error'
      }

      if (generatedImageId === undefined) {
        console.error(`${fnName}: id is null and generatedImageId is undefined`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 slideshowId,
                 slideTemplateId,
                 slideNo,
                 status,
                 title,
                 text,
                 narrationId,
                 generatedImageId)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 slideshowId,
                 slideTemplateId,
                 slideNo,
                 status,
                 title,
                 text,
                 narrationId,
                 generatedImageId)
    }
  }
}
