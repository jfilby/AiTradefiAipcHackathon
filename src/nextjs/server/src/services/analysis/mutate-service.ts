import { PrismaClient } from '@prisma/client'
import { AnalysisModel } from '@/models/trade-analysis/analysis-model'

// Models
const analysisModel = new AnalysisModel()

// Class
export class AnalysesMutateService {

  // Consts
  clName = 'AnalysesMutateService'

  // Code
  async upsert(
          prisma: PrismaClient,
          id: string | undefined,
          userProfileId: string,
          type: string,
          status: string,
          instrumentType: string,
          defaultMinScore: number,
          name: string,
          version: string,
          description: string,
          prompt: string) {

    // Get id
    if (id != null &&
        id === '') {

      id = undefined
    }

    // Upsert Analysis
    const analysis = await
            analysisModel.upsert(
              prisma,
              id ?? undefined,
              userProfileId,
              type,
              status,
              instrumentType,
              defaultMinScore,
              name,
              version,
              description,
              prompt)

    // Return
    return {
      status: true
    }
  }
}
