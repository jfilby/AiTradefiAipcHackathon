import { PrismaClient } from '@prisma/client'
import { YFinanceInstrumentContext } from '../../../types/yfinance-types'
import { YFinanceFinModel } from '@/models/yfinance-models/yfinance-fin-model'
import { YFinanceQuoteModel } from '@/models/yfinance-models/yfinance-quote-model'
import { CustomError } from '@/serene-core-server/types/errors'

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

    // Debug
    const fnName = `${this.clName}.getContext()`

    // Get quote
    const yFinanceQuote = await
            yFinanceQuoteModel.getByUniqueKey(
              prisma,
              instrumentId)

    if (yFinanceQuote == null) {
      throw new CustomError(`${fnName}: yFinanceQuote == null`)
    }

    // Get financials
    const yFinanceFins = await
            yFinanceFinModel.filter(
              prisma,
              instrumentId)

    if (yFinanceFins.length === 0) {
      throw new CustomError(`${fnName}: yFinanceFins.length === 0`)
    }

    // Get charts
    const yFinanceCharts = await
            yFinanceFinModel.filter(
              prisma,
              instrumentId)

    if (yFinanceCharts.length === 0) {
      throw new CustomError(`${fnName}: yFinanceCharts.length === 0`)
    }

    // Set context
    const yFinanceInstrumentContext: YFinanceInstrumentContext = {
      yFinanceQuote: yFinanceQuote,
      yFinanceFinancials: yFinanceFins,
      yFinanceCharts: yFinanceCharts
    }

    // Return
    return yFinanceInstrumentContext
  }
}
