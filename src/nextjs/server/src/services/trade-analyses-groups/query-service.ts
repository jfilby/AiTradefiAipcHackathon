import { PrismaClient } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { TradeAnalysesGroupModel } from '@/models/trade-analysis/trade-analyses-group-model'
import { TradeAnalysisModel } from '@/models/trade-analysis/trade-analysis-model'

// Models
const tradeAnalysesGroupModel = new TradeAnalysesGroupModel()
const tradeAnalysisModel = new TradeAnalysisModel()

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
          userProfileId: string,
          instrumentType: string | null) {

    // Debug
    const fnName = `${this.clName}.getLatest()`

    // Validate
    if (userProfileId == null) {
      throw new CustomError(`${fnName}: userProfileId == null`)
    }

    // Get latest (note: Prisma can't filter by the TradeAnalysesGroup's
    // minScore, so the inner query is separate).
    const tradeAnalysesGroups = await
            tradeAnalysesGroupModel.getLatestByInstrumentType(
              prisma,
              userProfileId,
              instrumentType ?? undefined,
              3)  // limitBy

    // Validate
    if (tradeAnalysesGroups == null) {
      throw new CustomError(`${fnName}: tradeAnalysesGroups == null`)
    }

    // Get TradeAnalysis records
    for (const tradeAnalysesGroup of tradeAnalysesGroups) {

      (tradeAnalysesGroup as any).ofTradeAnalyses = await
        tradeAnalysisModel.getByPassedMinScore(
          prisma,
          tradeAnalysesGroup.id,
          BaseDataTypes.activeStatus)
    }

    // Get count in New status
    const inNewStatus = await
            tradeAnalysesGroupModel.countByStatus(
              prisma,
              userProfileId,
              BaseDataTypes.newStatus)

    // Return
    return {
      status: true,
      tradeAnalysesGroups: tradeAnalysesGroups,
      inNewStatus: inNewStatus
    }
  }
}
