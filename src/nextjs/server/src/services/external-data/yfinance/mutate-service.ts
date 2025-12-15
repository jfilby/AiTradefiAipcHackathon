import { Exchange, Instrument, PrismaClient } from '@prisma/client'
import YahooFinance from 'yahoo-finance2'
import { CustomError } from '@/serene-core-server/types/errors'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { ExchangeModel } from '@/models/instruments/exchange-model'
import { InstrumentModel } from '@/models/instruments/instrument-model'
import { YFinanceChartModel } from '@/models/yfinance-models/yfinance-chart-model'
import { YFinanceFinModel } from '@/models/yfinance-models/yfinance-fin-model'
import { YFinanceQuoteModel } from '@/models/yfinance-models/yfinance-quote-model'
import { YFinanceUtilsService } from './utils-service'
import { YFinanceFinTypes, yFinanceIntervals } from '../../../types/yfinance-types'

// Models
const exchangeModel = new ExchangeModel()
const instrumentModel = new InstrumentModel()
const yFinanceChartModel = new YFinanceChartModel()
const yFinanceFinModel = new YFinanceFinModel()
const yFinanceQuoteModel = new YFinanceQuoteModel()

// Services
const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] })
const yFinanceUtilsService = new YFinanceUtilsService()

// Class
export class YFinanceMutateService {

  // Consts
  clName = 'YFinanceMutateService'

  importantFinanceFields = [
    'totalRevenue',
    'costOfRevenue',
    'grossProfit',
    'operatingIncome',
    'netIncome',
    'eps',
    'epsDiluted',
    'totalAssets',
    'totalLiabilities',
    'totalStockholderEquity',
    'longTermDebt',
    'shortTermDebt',
    'cash',
    'operatingCashflow',
    'capitalExpenditures',
    'freeCashFlow',
    'marketCap',
    'trailingPE',
    'forwardPE',
    'priceToBook',
    'beta',
    'dividendYield',
    'date',
    'currency',
  ]

  // Code
  async deleteFinanceData(
          prisma: PrismaClient,
          instrumentId: string) {

    // Delete by instrumentId
    await yFinanceChartModel.deleteByInstrumentId(
            prisma,
            instrumentId)

    await yFinanceChartModel.deleteByInstrumentId(
            prisma,
            instrumentId)

    await yFinanceChartModel.deleteByInstrumentId(
            prisma,
            instrumentId)
  }

  async run(prisma: PrismaClient,
            exchange: Exchange,
            instrument: Instrument) {

    // Debug
    const fnName = `${this.clName}.run()`

    console.log(`${fnName}: starting..`)

    // Get ticker?
    var ticker: string | undefined = undefined

    if (instrument.yahooFinanceTicker == null) {

      // Try to get the ticker
      ticker =
        yFinanceUtilsService.getTicker(
          instrument,
          exchange)

      // Debug
      console.log(`${fnName}: ticker: ` + JSON.stringify(ticker))

      // Validate
      if (ticker == null ||
          ticker === '') {

        // Debug
        console.warn(`${fnName}: ticker not valid..`)

        // Ticker not found
        instrument = await
          instrumentModel.update(
            prisma,
            instrument.id,
            undefined,  // exchangeId
            BaseDataTypes.inactiveStatus,
            undefined,  // symbol
            undefined,  // type
            undefined,  // name
            null)       // yahooFinanceTicker

        return false

      } else if (instrument.yahooFinanceTicker !== ticker) {

        // Set ticker
        instrument = await
          instrumentModel.update(
            prisma,
            instrument.id,
            undefined,  // exchangeId
            undefined,  // status
            undefined,  // symbol
            undefined,  // type
            undefined,  // name
            ticker)
      }
    }

    // Delete existing data
    await this.deleteFinanceData(
            prisma,
            instrument.id)

    // Debug
    console.log(`${fnName}: instrument: ` + JSON.stringify(instrument))

    // Save quote
    const found = await
              this.saveQuote(
              prisma,
              instrument)

    if (found === false) {

      // Debug
      console.warn(`${fnName}: couldn't save quote for ${ticker}`)

      // Not found, set to inactive
      instrument = await
        instrumentModel.update(
          prisma,
          instrument.id,
          undefined,  // exchangeId
          BaseDataTypes.inactiveStatus,
          undefined,  // symbol
          undefined,  // type
          undefined,  // name
          ticker)

      // Return not found
      return false
    }

    // Set ticker and status to active
    instrument = await
      instrumentModel.update(
        prisma,
        instrument.id,
        undefined,  // exchangeId
        BaseDataTypes.activeStatus,
        undefined,  // symbol
        undefined,  // type
        undefined,  // name
        ticker)

    // Save financials
    await this.saveFinancials(
            prisma,
            instrument)

    // Save charts
    await this.saveCharts(
            prisma,
            instrument)

    // Return OK
    return true
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

      // Get Y! Finance ticker
      const ticker =
              yFinanceUtilsService.getTicker(
                instrument,
                exchange)

      // Create instrument
      instrument = await
        instrumentModel.create(
          prisma,
          exchange.id,
          BaseDataTypes.activeStatus,
          instrumentName,
          instrumentType,
          instrumentName,
          ticker)
    }

    // Run
    await this.run(
            prisma,
            exchange.id,
            instrument.id)
  }

  async saveCharts(
          prisma: PrismaClient,
          instrument: Instrument) {

    // Save the last year on the day interval

    // Compute trailing 1-year window from today
    const today = new Date()
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(today.getFullYear() - 1)

    const period1 = oneYearAgo
    const period2 = today
    const interval = yFinanceIntervals.daily

    // Get last year of daily data
    const data = await yahooFinance.chart(
      instrument.yahooFinanceTicker!,
      {
        period1: period1,
        period2: period2,
        interval: interval
      })

    // Save
    const yFinanceChart = await
            yFinanceChartModel.upsert(
              prisma,
              undefined,  // id
              instrument.id,
              interval,
              period1,
              period2,
              data)
  }

  async saveFinancials(
          prisma: PrismaClient,
          instrument: Instrument) {

    // Save the last 3 quarters
    await this.saveFinancialsLast3Quarters(
            prisma,
            instrument)

    // Save the last 3 years
    await this.saveFinancialsLast3Years(
            prisma,
            instrument)
  }

  async saveFinancialsLast3Quarters(
          prisma: PrismaClient,
          instrument: Instrument) {

    // Debug
    const fnName = `${this.clName}.saveFinancialsLast3Quarters()`

    // Compute period1 = ~400 days ago (covers at least 4 quarters even around year boundaries)
    const period1Date = new Date(Date.now() - 400 * 24 * 60 * 60 * 1000)
    const period1 = period1Date.toISOString().split('T')[0]

    // Get financials for the last 4 quarters
    const data = await
            yahooFinance.fundamentalsTimeSeries(
              instrument.yahooFinanceTicker!,
              {
                period1: period1,
                type: 'quarterly',
                module: 'all'
              })

    // Validate
    if (!Array.isArray(data)) {
      throw new CustomError(`${fnName}: expected data to be an array`)
    }

    // Strip out non-important fields
    const keyData = this.stripNonImportantFinanceFields(data)

    // Save
    const yFinanceFin = await
            yFinanceFinModel.upsert(
              prisma,
              undefined,  // id
              instrument.id,
              YFinanceFinTypes.quarterly,
              period1Date,
              keyData)
  }

  async saveFinancialsLast3Years(
          prisma: PrismaClient,
          instrument: Instrument) {

    // Debug
    const fnName = `${this.clName}.saveFinancialsLast3Years()`

    // Compute period1 = 3 years ago, but on the 1st day of the year
    const period1Date = new Date(new Date().getFullYear() - 3, 0, 1)
    const period1 = period1Date.toISOString().split('T')[0]

    // Get financials for the last 3 years
    const data = await
            yahooFinance.fundamentalsTimeSeries(
              instrument.yahooFinanceTicker!,
              {
                period1: period1,
                type: 'annual',
                module: 'all'
              })

    // Validate
    if (!Array.isArray(data)) {
      throw new CustomError(`${fnName}: expected data to be an array`)
    }

    // Strip out non-important fields
    const keyData = this.stripNonImportantFinanceFields(data)

    // Save
    const yFinanceFin = await
            yFinanceFinModel.upsert(
              prisma,
              undefined,  // id
              instrument.id,
              YFinanceFinTypes.annual,
              period1Date,
              keyData)
  }

  async saveQuote(
          prisma: PrismaClient,
          instrument: Instrument): Promise<boolean> {

    // Debug
    const fnName = `${this.clName}.saveQuote()`

    // Get a quote for the Y! Finance symbol
    const quote = await
            yahooFinance.quote(instrument.yahooFinanceTicker!)

    // Validate
    if (quote == null) {

      console.log(`${fnName}: quote == null for ticker: ` +
                  `${instrument.yahooFinanceTicker}`)

      return false
    }

    // Upsert quote
    const yFinanceQuote = await
            yFinanceQuoteModel.upsert(
              prisma,
              undefined,  // id
              instrument.id,
              quote)

    // Return OK
    return true
  }

  stripNonImportantFinanceFields(data: any[]) {

    const outArray: any[] = []

    // Iterate entries of data
    for (const entry of data) {

      // Only important fields
      const out: any = {}

      for (const key of this.importantFinanceFields) {

        if (entry[key] !== undefined) {
          out[key] = entry[key]
        }
      }

      // Add to outArray
      outArray.push(out)
    }

    return outArray
  }
}
