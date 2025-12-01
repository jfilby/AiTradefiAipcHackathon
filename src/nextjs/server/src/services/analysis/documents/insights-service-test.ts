import { PrismaClient } from '@prisma/client'
import { TradingParameterTypes } from '@/types/trading-parameter-types'
import { ExchangeModel } from '@/models/instruments/exchange-model'
import { InstrumentModel } from '@/models/instruments/instrument-model'
import { WindowTypeModel } from '@/models/instruments/window-type-model'
import { DocInsightsService } from './insights-service'
import { ServerOnlyTypes } from '@/types/server-only-types'

// Models
const instrumentModel = new InstrumentModel()
const exchangeModel = new ExchangeModel()
const windowTypeModel = new WindowTypeModel()

// Services
const docInsightsService = new DocInsightsService()

// Class
export class DocInsightsServiceTests {

  // Consts
  clName = 'DocInsightsServiceTests'

  // Code
  async test(prisma: PrismaClient,
             userProfileId: string) {

    // Get Nasdaq exchange
    const nasdaqExchange = await
            exchangeModel.getByUniqueKey(
              prisma,
              ServerOnlyTypes.nasdaqExchangeName)

    // Get AAPL instrument
    const instrument = await
            instrumentModel.getByUniqueKey(
              prisma,
              nasdaqExchange.id,
              TradingParameterTypes.tslaSymbol)

    // Get the ultra-short WindowType
    const windowType = await
            windowTypeModel.getByUniqueKey(
              prisma,
              TradingParameterTypes.ultraShortWindowTypeName)

    // Call for a specific Instrument and WindowType
    const results = await
            docInsightsService.runForSymbolAndWindowType(
              prisma,
              userProfileId,
              instrument.exchangeId,
              instrument.symbol,
              windowType)
  }
}
