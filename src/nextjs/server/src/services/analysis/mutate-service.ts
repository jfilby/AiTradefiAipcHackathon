import { PrismaClient } from '@prisma/client'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { AnalysisModel } from '@/models/trade-analysis/analysis-model'
import { AnalysisTechModel } from '@/models/trade-analysis/analysis-tech-model'
import { GenerationsSettingsQueryService } from '../generations-settings/query-service'
import { SetupAnalysesTechService } from './setup-tech-service'

// Models
const analysisModel = new AnalysisModel()
const analysisTechModel = new AnalysisTechModel()

// Services
const generationsSettingsQueryService = new GenerationsSettingsQueryService()
const setupAnalysesTechService = new SetupAnalysesTechService()

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
              userProfileId,
              generationsSettings.id,
              type,
              status,
              instrumentType,
              defaultMinScore,
              name,
              version,
              description,
              prompt)

    // Get tech for the models to be used
    const analysisModelsInfo = await
            setupAnalysesTechService.getAnalysisModelsInfo(prisma)

    // Add AnalysisTech records
    for (const analysisModelInfo of analysisModelsInfo) {

      // Upsert
      const analysisTech = await
              analysisTechModel.upsert(
                prisma,
                undefined,  // id
                analysis.id,
                analysisModelInfo.tech.id,
                BaseDataTypes.activeStatus,
                analysisModelInfo.analysisModelSpec.leading)
    }

    // Return
    return {
      status: true
    }
  }
}
