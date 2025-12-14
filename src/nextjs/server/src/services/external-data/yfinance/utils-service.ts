import { Exchange, Instrument } from '@prisma/client'
import YahooFinance from 'yahoo-finance2'
import { CustomError } from '@/serene-core-server/types/errors'
import { YahooFinanceTypes } from '../../../types/yfinance-types'

// Services
const yahooFinance = new YahooFinance()

// Class
export class YFinanceUtilsService {

  // Consts
  clName = 'YFinanceUtilsService'

  // Code
  getExhangeSuffix(exchangeName: string) {

    // Debug
    const fnName = `${this.clName}.getExhangeSuffix()`

    // Iter records
    for (const suffixRecord of YahooFinanceTypes.exchangeNameToYahooSuffix) {

      if (suffixRecord.exchange === exchangeName) {
        return suffixRecord.yahooSuffix
      }
    }

    // Not found
    throw new CustomError(`${fnName}: yahoo suffix not found`)
  }

  getTicker(
    instrument: Instrument,
    exchange: Exchange) {

    return `${instrument.symbol}${exchange.yahooFinanceSuffix}`
  }
}
