import { PrismaClient } from '@prisma/client'
import { TradeAnalysisModel } from '@/models/trade-analysis/trade-analysis-model'

// Models
const tradeAnalysisModel = new TradeAnalysisModel()

// Class
export class TradeAnalysisQueryService {

  // Consts
  clName = 'TradeAnalysisQueryService'

  // Code
  async getById(
          prisma: PrismaClient,
          instrumentId: string) {

    // Get latest
    const tradeAnalysis = await
            tradeAnalysisModel.getById(
              prisma,
              instrumentId)

    // Return
    return {
      status: true,
      tradeAnalysis: tradeAnalysis
    }
  }
}
