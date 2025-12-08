import { PrismaClient } from '@prisma/client'
import { AnalysisModel } from '@/models/trade-analysis/analysis-model'

// Models
const analysisModel = new AnalysisModel()

// Class
export class AnalysesQueryService {

  // Consts
  clName = 'AnalysesQueryService'

  // Code
  async filter(
          prisma: PrismaClient,
          userProfileId: string,
          status: string | undefined = undefined,
          instrumentType: string | undefined = undefined) {

    const analyses = await
            analysisModel.filter(
              prisma,
              undefined,  // type
              status,
              instrumentType)

    return {
      status: true,
      analyses: analyses
    }
  }

  async getById(
          prisma: PrismaClient,
          userProfileId: string,
          analysisId: string) {

    const analysis = await
            analysisModel.getById(
              prisma,
              analysisId)

    return {
      status: true,
      analysis: analysis
    }
  }
}
