import * as fs from 'fs'
import * as path from 'path'
import { PrismaClient } from '@prisma/client'
import { ConsoleService } from '@/serene-core-server/services/console/service'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { AnalysisModel } from '@/models/trade-analysis/analysis-model'
import { ServerOnlyTypes } from '@/types/server-only-types'
import { GenerationsSettingsQueryService } from '../generations-settings/query-service'
import { SetupAnalysesTechService } from './setup-tech-service'

// Models
const analysisModel = new AnalysisModel()

// Services
const consoleService = new ConsoleService()
const generationsSettingsQueryService = new GenerationsSettingsQueryService()
const setupAnalysesTechService = new SetupAnalysesTechService()

// Class
export class SetupAnalysesService {

  // Consts
  clName = 'SetupAnalysesService'

  // Code
  async getJsonFiles(
          dir: string,
          fileList: string[] = []): Promise<any> {

    // Debug
    const fnName = `${this.clName}.walkDir()`

    // Read the dir
    var files = await fs.promises.readdir(dir)

    // Walk files
    for (const file of files) {

      // Stat the file
      const filePath = path.join(dir, file)
      const stat = await fs.promises.stat(filePath)

      // If a directory, call this function
      if (stat.isDirectory() === false) {

        if (file.endsWith('.json')) {
          fileList.push(filePath)
        }
      }
    }

    // Debug
    // console.log(`${fnName}: fileList: ${fileList.length}`)

    // Return file list
    return fileList
  }

  async loadJson(
          prisma: PrismaClient,
          userProfileId: string,
          definitions: any[]) {

    // Get the default GenerationsSettings
    const generationsSettings = await
            generationsSettingsQueryService.getDefault(prisma)

    // Load definitions
    for (const definition of definitions) {

      var type: string | undefined = undefined

      if (definition.type === 'screener') {
        type = BaseDataTypes.screenerType

      } else if (definition.type === 'evaluator') {
        type = BaseDataTypes.evaluatorType
      }

      // Upsert Analysis
      const analysis = await
              analysisModel.upsert(
                prisma,
                undefined,  // id
                userProfileId,
                generationsSettings.id,
                type,
                BaseDataTypes.activeStatus,
                definition.instrumentType,
                ServerOnlyTypes.defaultMinScore,
                definition.name,
                definition.description,
                definition.prompt.join('\n'))

      // Setup analysis tech
      await setupAnalysesTechService.setupAnalysis(
              prisma,
              analysis)
    }
  }

  async setup(
          prisma: PrismaClient,
          userProfileId: string) {

    // Debug
    const fnName = `${this.clName}.setup()`

    // Read in the JSON string
    console.log(`${fnName}: Enter the path containing the .json files ` +
                `with the analyses definitions to load`)

    const jsonPath = await
            consoleService.askQuestion('> ')

    // Walk the path and get all json files
    const files = await this.getJsonFiles(jsonPath)

    // Process the JSON
    for (const file of files) {

      console.log(`${fnName}: processing file: ${file}`)

      const jsonStr = fs.readFileSync(file, 'utf-8')
      const json = JSON.parse(jsonStr)

      await this.loadJson(
              prisma,
              userProfileId,
              json)
    }
  }
}
