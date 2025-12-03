import { Exchange, Instrument, PrismaClient } from '@prisma/client'
import YahooFinance from 'yahoo-finance2'
import { CustomError } from '@/serene-core-server/types/errors'
import { ExchangeModel } from '@/models/instruments/exchange-model'
import { InstrumentModel } from '@/models/instruments/instrument-model'
import { YFinanceQuoteModel } from '@/models/yfinance-models/yfinance-quote-model'
import { YFinanceUtilsService } from './utils-service'

// Models
const exchangeModel = new ExchangeModel()
const instrumentModel = new InstrumentModel()
const yFinanceQuoteModel = new YFinanceQuoteModel()

// Services
const yahooFinance = new YahooFinance()
const yFinanceUtilsService = new YFinanceUtilsService()

// Class
export class YFinanceMutateService {

  // Consts
  clName = 'YFinanceMutateService'

  // Code
  async run(prisma: PrismaClient,
            exchange: Exchange,
            instrument: Instrument) {

    // Get ticker
    const ticker =
            yFinanceUtilsService.getTicker(
              instrument,
              exchange)

    // Save quote
    await this.saveQuote(
            prisma,
            ticker,
            instrument)
  }

  async runByNames(
          prisma: PrismaClient,
          exchangeName: string,
          instrumentName: string,
          instrumentType: string) {

    // Debug
    const fnName = `${this.clName}.runByNames()`

    // Get exchange
    const exchange = await
            exchangeModel.getByUniqueKey(
              prisma,
              exchangeName)

    if (exchange == null) {
      throw new CustomError(`${fnName}: exchange == null`)
    }

    // Get instrument
    var instrument = await
          instrumentModel.getByUniqueKey(
            prisma,
            exchange.id,
            instrumentName)

    if (instrument == null) {

      // Create instrument
      instrument = await
        instrumentModel.create(
          prisma,
          exchange.id,
          instrumentName,
          instrumentType,
          instrumentName)
    }

    // Run
    await this.run(
            prisma,
            exchange.id,
            instrument.id)
  }

  async saveQuote(
          prisma: PrismaClient,
          ticker: string,
          instrument: Instrument) {

    // Get a quote for the Y! Finance symbol
    const quote = await
            yahooFinance.quote(ticker)

    // Upsert quote
    const yFinanceQuote = await
            yFinanceQuoteModel.upsert(
              prisma,
              undefined,  // id
              instrument.id,
              quote)
  }
}
