import { PrismaClient } from '@prisma/client'

export class SlideModel {

  // Consts
  clName = 'SlideModel'

  // Code
  async create(
          prisma: PrismaClient,
          slideshowId: string,
          index: number,
          slideNo: number,
          status: string,
          type: string,
          title: string,
          text: string | null,
          audioPath: string | null,
          imagePath: string | null) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.slide.create({
        data: {
          slideshowId: slideshowId,
          index: index,
          slideNo: slideNo,
          status: status,
          type: type,
          title: title,
          text: text,
          audioPath: audioPath,
          imagePath: imagePath
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
          index: number | undefined = undefined,
          slideNo: number | undefined = undefined,
          status: string | undefined = undefined,
          type: string | undefined = undefined) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query
    try {
      return await prisma.slide.findMany({
        where: {
          slideshowId: slideshowId,
          index: index,
          slideNo: slideNo,
          status: status,
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

  async getByUniqueKey(
          prisma: PrismaClient,
          slideshowId: string,
          index: number) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Validate
    if (slideshowId == null) {
      console.error(`${fnName}: slideshowId == null`)
      throw 'Validation error'
    }

    if (index == null) {
      console.error(`${fnName}: index == null`)
      throw 'Validation error'
    }

    // Query
    var slide: any = null

    try {
      slide = await prisma.slide.findFirst({
        where: {
          slideshowId: slideshowId,
          index: index
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
          slideshowId: string | undefined,
          index: number | undefined,
          slideNo: number | undefined,
          status: string | undefined,
          type: string | undefined,
          title: string | undefined,
          text: string | null | undefined,
          audioPath: string | null | undefined,
          imagePath: string | null | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.slide.update({
        data: {
          slideshowId: slideshowId,
          index: index,
          slideNo: slideNo,
          status: status,
          type: type,
          title: title,
          text: text,
          audioPath: audioPath,
          imagePath: imagePath
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
          index: number | undefined,
          slideNo: number | undefined,
          status: string | undefined,
          type: string | undefined,
          title: string | undefined,
          text: string | null | undefined,
          audioPath: string | null | undefined,
          imagePath: string | null | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    console.log(`${fnName}: starting with id: ` + JSON.stringify(id))

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        slideshowId != null &&
        index != null) {

      const slide = await
              this.getByUniqueKey(
                prisma,
                slideshowId,
                index)

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

      if (index == null) {
        console.error(`${fnName}: id is null and index is null`)
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

      if (type == null) {
        console.error(`${fnName}: id is null and type is null`)
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

      if (audioPath === undefined) {
        console.error(`${fnName}: id is null and audioPath is undefined`)
        throw 'Prisma error'
      }

      if (imagePath === undefined) {
        console.error(`${fnName}: id is null and imagePath is undefined`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 slideshowId,
                 index,
                 slideNo,
                 status,
                 type,
                 title,
                 text,
                 audioPath,
                 imagePath)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 slideshowId,
                 index,
                 slideNo,
                 status,
                 type,
                 title,
                 text,
                 audioPath,
                 imagePath)
    }
  }
}
