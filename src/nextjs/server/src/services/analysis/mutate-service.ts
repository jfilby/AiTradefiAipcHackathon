import { PrismaClient } from '@prisma/client'
import { AnalysisModel } from '@/models/trade-analysis/analysis-model'
import { GenerationsSettingsQueryService } from '../generations-settings/query-service'

// Models
const analysisModel = new AnalysisModel()

// Services
const generationsSettingsQueryService = new GenerationsSettingsQueryService()

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

    // Debug
    const fnName = `${this.clName}.upsert()`

    // Get id
    if (id != null &&
        id === '') {

      id = undefined
    }

    // Get the default GenerationsSettings
    const generationsSettings = await
            generationsSettingsQueryService.getDefault(prisma)

    // Upsert Analysis
    const analysis = await
            analysisModel.upsert(
              prisma,
              id ?? undefined,
              generationsSettings.id,
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
