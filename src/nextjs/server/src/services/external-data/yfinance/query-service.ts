import { PrismaClient } from '@prisma/client'
import { YFinanceInstrumentContext } from './types'
import { YFinanceFinModel } from '@/models/yfinance-models/yfinance-fin-model'
import { YFinanceQuoteModel } from '@/models/yfinance-models/yfinance-quote-model'

// Models
const yFinanceQuoteModel = new YFinanceQuoteModel()
const yFinanceFinModel = new YFinanceFinModel()

export class YFinanceQueryService {

  // Consts
  clName = 'YFinanceQueryService'

  // Code
  async getContext(
          prisma: PrismaClient,
          instrumentId: string) {

    // Get context records
    const yFinanceQuote = await
            yFinanceQuoteModel.getByUniqueKey(
              prisma,
              instrumentId)

    const yFinanceFins = await
            yFinanceFinModel.filter(
              prisma,
              instrumentId)

    // Set context
    const yFinanceInstrumentContext: YFinanceInstrumentContext = {
      yFinanceQuote: yFinanceQuote,
      yFinanceFinancials: yFinanceFins
    }

    // Return
    return yFinanceInstrumentContext
  }
}
