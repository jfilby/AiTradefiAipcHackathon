import { PrismaClient } from '@prisma/client'
import { TradeAnalysesGroupModel } from '@/models/trade-analysis/trade-analyses-group-model'

// Models
const tradeAnalysesGroupModel = new TradeAnalysesGroupModel()

// Class
export class HousekeepingService {
  
  // Consts
  clName = 'HousekeepingService'

  // Code
  async run(prisma: PrismaClient) {

    // Debug
    const fnName = `${this.clName}.run()`

    // console.log(`${fnName}: running..`)

    // Delete old runs
    await tradeAnalysesGroupModel.deleteOldIncompleteRuns(prisma)

    // Debug
    // console.log(`${fnName}: completed`)
  }
}
