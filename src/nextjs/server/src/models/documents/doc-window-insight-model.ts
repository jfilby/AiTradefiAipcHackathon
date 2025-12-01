import { PrismaClient } from '@prisma/client'

export class DocWindowInsightModel {

  // Consts
  clName = 'DocWindowInsightModel'

  // Code
  async create(
          prisma: PrismaClient,
          windowTypeId: string,
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
      return await prisma.docWindowInsight.create({
        data: {
          windowTypeId: windowTypeId,
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
      return await prisma.docWindowInsight.delete({
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
          windowTypeId: string | undefined,
          instrumentId: string | undefined,
          agentUserId: string | undefined,
          status: string | undefined,
          category: string | undefined) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query
    try {
      return await prisma.docWindowInsight.findMany({
        where: {
          windowTypeId: windowTypeId,
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
    var docWindowInsight: any = null

    try {
      docWindowInsight = await prisma.docWindowInsight.findUnique({
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
    return docWindowInsight
  }

  async getByUniqueKey(
          prisma: PrismaClient,
          windowTypeId: string,
          instrumentId: string,
          agentUserId: string) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Validate
    if (windowTypeId == null) {
      console.error(`${fnName}: windowTypeId == null`)
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
    var docWindowInsight: any = null

    try {
      docWindowInsight = await prisma.docWindowInsight.findFirst({
        where: {
          windowTypeId: windowTypeId,
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
    return docWindowInsight
  }

  async update(
          prisma: PrismaClient,
          id: string,
          windowTypeId: string | undefined,
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
      return await prisma.docWindowInsight.update({
        data: {
          windowTypeId: windowTypeId,
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
               windowTypeId: string | undefined,
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
        windowTypeId != null &&
        instrumentId != null &&
        agentUserId != null) {

      const docWindowInsight = await
              this.getByUniqueKey(
                prisma,
                windowTypeId,
                instrumentId,
                agentUserId)

      if (docWindowInsight != null) {
        id = docWindowInsight.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (windowTypeId == null) {
        console.error(`${fnName}: id is null and windowTypeId is null`)
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
                 windowTypeId,
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
                 windowTypeId,
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
