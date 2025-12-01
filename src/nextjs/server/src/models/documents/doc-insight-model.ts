import { PrismaClient } from '@prisma/client'

export class DocInsightModel {

  // Consts
  clName = 'DocInsightModel'

  // Code
  async create(
          prisma: PrismaClient,
          documentId: string,
          instrumentId: string,
          agentUserId: string,
          status: string,
          advisedTradeType: string | null,
          category: string,
          sentimentScore: number,
          confidenceScore: number,
          potencyScore: number,
          noveltyScore: number,
          urgencyScore: number,
          starting: Date,
          ending: Date | null) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.docInsight.create({
        data: {
          documentId: documentId,
          instrumentId: instrumentId,
          agentUserId: agentUserId,
          status: status,
          advisedTradeType: advisedTradeType,
          category: category,
          sentimentScore: sentimentScore,
          confidenceScore: confidenceScore,
          potencyScore: potencyScore,
          noveltyScore: noveltyScore,
          urgencyScore: urgencyScore,
          starting: starting,
          ending: ending
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
      return await prisma.docInsight.delete({
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
          documentId: string | undefined,
          instrumentId: string | undefined,
          agentUserId: string | undefined,
          status: string | undefined,
          category: string | undefined) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query
    try {
      return await prisma.docInsight.findMany({
        where: {
          documentId: documentId,
          instrumentId: instrumentId,
          agentUserId: agentUserId,
          status: status,
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
    var docInsight: any = null

    try {
      docInsight = await prisma.docInsight.findUnique({
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
    return docInsight
  }

  async getByUniqueKey(
          prisma: PrismaClient,
          documentId: string,
          instrumentId: string,
          agentUserId: string) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Validate
    if (documentId == null) {
      console.error(`${fnName}: documentId == null`)
      throw 'Validation error'
    }

    if (instrumentId == null) {
      console.error(`${fnName}: instrumentId == null`)
      throw 'Validation error'
    }

    if (agentUserId == null) {
      console.error(`${fnName}: agentUserId == null`)
      throw 'Validation error'
    }

    // Query
    var docInsight: any = null

    try {
      docInsight = await prisma.docInsight.findFirst({
        where: {
          documentId: documentId,
          instrumentId: instrumentId,
          agentUserId: agentUserId
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return docInsight
  }

  async update(
          prisma: PrismaClient,
          id: string,
          documentId: string | undefined,
          instrumentId: string | undefined,
          agentUserId: string | undefined,
          status: string | undefined,
          advisedTradeType: string | null | undefined,
          category: string | undefined,
          sentimentScore: number | undefined,
          confidenceScore: number | undefined,
          potencyScore: number | undefined,
          noveltyScore: number | undefined,
          urgencyScore: number | undefined,
          starting: Date | undefined,
          ending: Date | null | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.docInsight.update({
        data: {
          documentId: documentId,
          instrumentId: instrumentId,
          agentUserId: agentUserId,
          status: status,
          advisedTradeType: advisedTradeType,
          category: category,
          sentimentScore: sentimentScore,
          confidenceScore: confidenceScore,
          potencyScore: potencyScore,
          noveltyScore: noveltyScore,
          urgencyScore: urgencyScore,
          starting: starting,
          ending: ending
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
               documentId: string | undefined,
               instrumentId: string | undefined,
               agentUserId: string | undefined,
               status: string | undefined,
               advisedTradeType: string | null | undefined,
               category: string | undefined,
               sentimentScore: number | undefined,
               confidenceScore: number | undefined,
               potencyScore: number | undefined,
               noveltyScore: number | undefined,
               urgencyScore: number | undefined,
               starting: Date | undefined,
               ending: Date | null | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        documentId != null &&
        instrumentId != null &&
        agentUserId != null) {

      const docInsight = await
              this.getByUniqueKey(
                prisma,
                documentId,
                instrumentId,
                agentUserId)

      if (docInsight != null) {
        id = docInsight.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (documentId == null) {
        console.error(`${fnName}: id is null and documentId is null`)
        throw 'Prisma error'
      }

      if (instrumentId == null) {
        console.error(`${fnName}: id is null and instrumentId is null`)
        throw 'Prisma error'
      }

      if (agentUserId == null) {
        console.error(`${fnName}: id is null and agentUserId is null`)
        throw 'Prisma error'
      }

      if (status == null) {
        console.error(`${fnName}: id is null and status is null`)
        throw 'Prisma error'
      }

      if (advisedTradeType === undefined) {
        console.error(`${fnName}: id is null and advisedTradeType is undefined`)
        throw 'Prisma error'
      }

      if (category == null) {
        console.error(`${fnName}: id is null and category is null`)
        throw 'Prisma error'
      }

      if (sentimentScore == null) {
        console.error(`${fnName}: id is null and sentimentScore is null`)
        throw 'Prisma error'
      }

      if (confidenceScore == null) {
        console.error(`${fnName}: id is null and confidenceScore is null`)
        throw 'Prisma error'
      }

      if (potencyScore == null) {
        console.error(`${fnName}: id is null and potencyScore is null`)
        throw 'Prisma error'
      }

      if (noveltyScore == null) {
        console.error(`${fnName}: id is null and noveltyScore is null`)
        throw 'Prisma error'
      }

      if (urgencyScore == null) {
        console.error(`${fnName}: id is null and urgencyScore is null`)
        throw 'Prisma error'
      }

      if (starting == null) {
        console.error(`${fnName}: id is null and starting is null`)
        throw 'Prisma error'
      }

      if (ending === undefined) {
        console.error(`${fnName}: id is null and ending is undefined`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 documentId,
                 instrumentId,
                 agentUserId,
                 status,
                 advisedTradeType,
                 category,
                 sentimentScore,
                 confidenceScore,
                 potencyScore,
                 noveltyScore,
                 urgencyScore,
                 starting,
                 ending)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 documentId,
                 instrumentId,
                 agentUserId,
                 status,
                 advisedTradeType,
                 category,
                 sentimentScore,
                 confidenceScore,
                 potencyScore,
                 noveltyScore,
                 urgencyScore,
                 starting,
                 ending)
    }
  }
}
