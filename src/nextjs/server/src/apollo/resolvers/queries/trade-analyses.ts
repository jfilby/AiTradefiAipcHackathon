import { prisma } from '@/db'
import { TradeAnalysisQueryService } from '@/services/trade-analysis/query-service'

// Services
const tradeAnalysisQueryService = new TradeAnalysisQueryService()

// Code
export async function getTradeAnalysisById(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  // Debug
  const fnName = `getTradeAnalysisById()`

  // Get instruments
  const results = await
          tradeAnalysisQueryService.getById(
            prisma,
            args.instrumentId)

  // Return
  return results
}

export async function getLatestTradeAnalyses(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  // Debug
  const fnName = `getLatestTradeAnalyses()`

  // Debug
  console.log(`${fnName}: starting..`)

  // Get instruments
  const results = await
          tradeAnalysisQueryService.getLatest(
            prisma,
            null)  // any instrumentType

  // Debug
  console.log(`${fnName}: results: ` + JSON.stringify(results))

  // Return
  return results
}
