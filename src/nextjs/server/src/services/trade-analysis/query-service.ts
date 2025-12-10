import { PrismaClient } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { ServerOnlyTypes } from '@/types/server-only-types'
import { TradeAnalysesGroupModel } from '@/models/trade-analysis/trade-analyses-group-model'
import { TradeAnalysisModel } from '@/models/trade-analysis/trade-analysis-model'

// Models
const tradeAnalysesGroupModel = new TradeAnalysesGroupModel()
const tradeAnalysisModel = new TradeAnalysisModel()

// Class
export class TradeAnalysisQueryService {

  // Consts
  clName = 'TradeAnalysisQueryService'

  // Code
  async canRunTradeAnalysis(
          prisma: PrismaClient,
          analysisId: string) {

    // Debug
    const fnName = `${this.clName}.canRunTradeAnalysis()`

    // Don't run another group until at least a week (after screener runs at max)
    const latestTradeAnalysesGroup = await
            tradeAnalysesGroupModel.getLatest(
              prisma,
              analysisId,
              1)  // limitBy

    if (latestTradeAnalysesGroup == null){
      throw new CustomError(`${fnName}: latestTradeAnalysesGroup == null`)
    }

    // Debug
    // console.log(`${fnName}: latestTradeAnalysesGroup.length: ` +
    //             `${latestTradeAnalysesGroup.length}`)

    // Record to check?
    if (latestTradeAnalysesGroup.length > 0) {

      // Debug
      // console.log(`${fnName}: tradeAnalysisGroupId: ` +
      //             `${latestTradeAnalysesGroup[0].id}`)

      // Screener runs at max?
      if (latestTradeAnalysesGroup[0].screenerRuns <
          ServerOnlyTypes.maxScreenerRuns) {

        // console.log(`${fnName}: screener runs not at max (true)`)
        return true
      }

      // At least a week?
      const today = new Date()
      const diff = today.getTime() - latestTradeAnalysesGroup[0].day.getTime()
      const diffDays = Math.floor(diff / (1000 * 3600 * 24))

      // Debug
      // console.log(`${fnName}: from: ${latestTradeAnalysesGroup[0].day.getTime()}`)
      // console.log(`${fnName}: diffDays: ${diffDays}`)

      // Insufficient days past?
      if (diffDays < 7) {
        // console.log(`${fnName}: diffDays < 7 (false)`)
        return false
      }
    }

    // Can run trade analysis
    // console.log(`${fnName}: no reason not to run (true)`)
    return true
  }

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
