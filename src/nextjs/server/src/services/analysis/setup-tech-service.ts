import { Analysis, PrismaClient, Tech } from '@prisma/client'
import { AiTechDefs } from '@/serene-ai-server/types/tech-defs'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { AnalysisModel } from '@/models/trade-analysis/analysis-model'
import { AnalysisTechModel } from '@/models/trade-analysis/analysis-tech-model'
import { TechModel } from '@/serene-core-server/models/tech/tech-model'
import { CustomError } from '@/serene-core-server/types/errors'

// Models
const analysisModel = new AnalysisModel()
const analysisTechModel = new AnalysisTechModel()
const techModel = new TechModel()

// Interfaces
interface AnalysisModelSpec {
  variantName: string
  leading: boolean
}

interface AnalysisModelInfo {
  analysisModelSpec: AnalysisModelSpec
  tech: Tech
}

// Class
export class SetupAnalysesTechService {

  // Consts
  clName = 'SetupAnalysesTechService'

  analysisModelSpecs: AnalysisModelSpec[] = [
    {
      // variantName: AiTechDefs.googleGemini_V2pt5ProFree,
      variantName: AiTechDefs.googleGemini_V2pt5FlashFree,
      leading: true
    }
  ]

  // Code
  async getAnalysisModelsInfo(prisma: PrismaClient) {

    // Debug
    const fnName = `${this.clName}.getAnalysisModelsInfo()`

    var analysisModelsInfo: AnalysisModelInfo[] = []

    for (const analysisModelSpec of this.analysisModelSpecs) {

      const tech = await
              techModel.getByVariantName(
                prisma,
                analysisModelSpec.variantName)

      if (tech == null) {
        throw new CustomError(`${fnName}: tech == null for variantName: ` +
                              `${analysisModelSpec.variantName}`)
      }

      analysisModelsInfo.push({
        analysisModelSpec: analysisModelSpec,
        tech: tech
      })
    }

    return analysisModelsInfo
  }

  async setup(
          prisma: PrismaClient,
          userProfileId: string) {

    // Debug
    const fnName = `${this.clName}.setup()`

    // Iterate Analyses
    const analyses = await
            analysisModel.filter(
              prisma,
              userProfileId,
              undefined,  // generationsSettingsId
              undefined,  // type
              BaseDataTypes.activeStatus)

    // Get tech for the models to be used
    const analysisModelsInfo = await this.getAnalysisModelsInfo(prisma)

    // Get/create TechAnalysis records
    console.log(`${fnName}: ${analyses.length} analyses..`)

    for (const analysis of analyses) {

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
    }
  }

  async setupAnalysis(
          prisma: PrismaClient,
          analysis: Analysis) {

    // Debug
    const fnName = `${this.clName}.setup()`

    // Get tech for the models to be used
    const analysisModelsInfo = await this.getAnalysisModelsInfo(prisma)

    // Get/create TechAnalysis records
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
  }
}
