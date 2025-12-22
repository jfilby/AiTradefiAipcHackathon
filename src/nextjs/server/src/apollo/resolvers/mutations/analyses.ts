import { prisma } from '@/db'
import { AnalysesMutateService } from '@/services/analysis/mutate-service'

// Services
const analysesMutateService = new AnalysesMutateService()

// Code
export async function upsertAnalysis(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  // Debug
  const fnName = `upsertAnalysis()`

  // console.log(`${fnName}: args: ` + JSON.stringify(args))

  // Get instruments
  const results = await
          analysesMutateService.upsert(
            prisma,
            args.id,
            args.userProfileId,
            args.type,
            args.status,
            args.instrumentType,
            args.defaultMinScore,
            args.name,
            args.description,
            args.prompt)

  // Return
  return results
}
