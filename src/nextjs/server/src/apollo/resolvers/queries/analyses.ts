import { prisma } from '@/db'
import { AnalysesQueryService } from '@/services/analysis/query-service'

// Services
const analysesQueryService = new AnalysesQueryService()

// Code
export async function getAnalysisById(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  // Debug
  const fnName = `getAnalysisById()`

  // Get instruments
  const results = await
          analysesQueryService.getById(
            prisma,
            args.userProfileId,
            args.analysisId)

  // Return
  return results
}

export async function getAnalyses(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  // Debug
  const fnName = `getAnalyses()`

  // console.log(`${fnName}: args: ` + JSON.stringify(args))

  // Get instruments
  const results = await
          analysesQueryService.filter(
            prisma,
            args.userProfileId,
            undefined,  // BaseDataTypes.activeStatus,
            args.instrumentType ?? undefined)

  // Return
  return results
}
