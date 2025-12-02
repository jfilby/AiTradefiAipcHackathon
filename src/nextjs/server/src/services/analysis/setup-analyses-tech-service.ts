import { PrismaClient, Tech } from '@prisma/client'
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
      variantName: AiTechDefs.googleGemini_V2pt5ProFree,
      leading: true
    }
  ]

  // Code
  async setup(prisma: PrismaClient) {

    // Debug
    const fnName = `${this.clName}.setup()`

    // Iterate Analyses
    const analyses = await
            analysisModel.filter(
              prisma,
              BaseDataTypes.activeStatus)

    // Get tech for the models to be used
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

    // Get/create TechAnalysis records
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
}
