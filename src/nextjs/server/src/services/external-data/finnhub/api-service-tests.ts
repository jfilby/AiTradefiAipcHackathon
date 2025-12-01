import { PrismaClient } from '@prisma/client'
import { ServerOnlyTypes } from '@/types/server-only-types'
import { TradingParameterTypes } from '@/types/trading-parameter-types'
import { DocSourceModel } from '@/models/documents/doc-source-model'
import { FinnHubApiService } from './api-service'

// Services
const finnHubApiService = new FinnHubApiService()

// Models
const docSourceModel = new DocSourceModel()

// Class
export class FinnHubApiServiceTests {

  // Consts
  clName = 'FinnHubApiServiceTests'

  // Code
  async tests(prisma: PrismaClient) {

    // Debug
    const fnName = `${this.clName}.tests()`

    // Get DocSource
    const docSource = await
            docSourceModel.getByUniqueKey(
              prisma,
              ServerOnlyTypes.finnHubNewsSourceName)

    // Get dates to test with
    const today = new Date()
    const threeDaysAgo = new Date(today)
    threeDaysAgo.setDate(today.getDate() - 3)

    // Test
    try {
      await finnHubApiService.getComanyNews(
              prisma,
              docSource.id,
              TradingParameterTypes.aaplSymbol,
              threeDaysAgo,
              today)

    } catch (err) {
      console.error(`${fnName}: error`, err)
    }
  }
}
