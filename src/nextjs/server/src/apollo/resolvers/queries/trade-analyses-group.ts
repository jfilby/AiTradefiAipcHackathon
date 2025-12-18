import { prisma } from '@/db'
import { TradeAnalysesGroupQueryService } from '@/services/trade-analyses-groups/query-service'
import { TradeAnalysisQueryService } from '@/services/trade-analysis/query-service'

// Services
const tradeAnalysesGroupQueryService = new TradeAnalysesGroupQueryService()
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
            args.tradeAnalysisId)

  // Return
  return results
}

export async function getTradeAnalysesGroupById(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  // Debug
  const fnName = `getTradeAnalysesGroupById()`

  // Get instruments
  const results = await
          tradeAnalysesGroupQueryService.getById(
            prisma,
            args.tradeAnalysesGroupId)

  // Return
  return results
}

export async function getLatestTradeAnalysesGroups(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  // Debug
  const fnName = `getLatestTradeAnalysesGroup()`

  // Debug
  // console.log(`${fnName}: starting..`)

  // Get instruments
  const results = await
          tradeAnalysesGroupQueryService.getLatest(
            prisma,
            null)  // any instrumentType

  // Debug
  // console.log(`${fnName}: results: ` + JSON.stringify(results))

  // Return
  return results
}
