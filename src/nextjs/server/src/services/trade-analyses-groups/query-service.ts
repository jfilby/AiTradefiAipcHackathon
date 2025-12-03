import { PrismaClient } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { TradeAnalysesGroupModel } from '@/models/trade-analysis/trade-analyses-group-model'

// Models
const tradeAnalysesGroupModel = new TradeAnalysesGroupModel()

// Class
export class TradeAnalysesGroupQueryService {

  // Consts
  clName = 'TradeAnalysesGroupQueryService'

  // Code
  async getById(
          prisma: PrismaClient,
          instrumentId: string) {

    // Get latest
    const tradeAnalysesGroup = await
            tradeAnalysesGroupModel.getById(
              prisma,
              instrumentId)

    // Return
    return {
      status: true,
      tradeAnalysesGroup: tradeAnalysesGroup
    }
  }

  async getLatest(
          prisma: PrismaClient,
          instrumentType: string | null) {

    // Debug
    const fnName = `${this.clName}.getLatest()`

    // Get latest
    const tradeAnalysesGroups = await
            tradeAnalysesGroupModel.getLatest(
              prisma,
              instrumentType ?? undefined,
              3)  // limitBy

    // Validate
    if (tradeAnalysesGroups == null) {
      throw new CustomError(`${fnName}: tradeAnalysesGroups == null`)
    }

    // Return
    return {
      status: true,
      tradeAnalysesGroups: tradeAnalysesGroups
    }
  }
}
