import * as fs from 'fs'
import * as path from 'path'
import { PrismaClient } from '@prisma/client'
import { ConsoleService } from '@/serene-core-server/services/console/service'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { AnalysisModel } from '@/models/trade-analysis/analysis-model'
import { ServerOnlyTypes } from '@/types/server-only-types'

// Models
const analysisModel = new AnalysisModel()

// Services
const consoleService = new ConsoleService()

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
          definitions: any[]) {

    for (const definition of definitions) {

      var type: string | undefined = undefined

      if (definition.type === 'screener') {
        type = ServerOnlyTypes.screenerType

      } else if (definition.type === 'evaluator') {
        type = ServerOnlyTypes.evaluatorType
      }

      const analysis = await
              analysisModel.upsert(
                prisma,
                undefined,  // id
                type,
                BaseDataTypes.activeStatus,
                definition.instrumentType,
                definition.name,
                definition.version,
                definition.description,
                definition.prompt.join('\n'))
    }
  }

  async setup(prisma: PrismaClient) {

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
              json)
    }
  }
}
