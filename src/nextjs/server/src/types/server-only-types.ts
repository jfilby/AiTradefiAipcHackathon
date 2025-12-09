import { BaseDataTypes } from '@/shared/types/base-data-types'
import { Exchange } from '@prisma/client'

export class ServerOnlyTypes {

  // Document categories
  static generalNewsCategory = 'N'

  // Chat settings
  static defaultChatSettingsName = 'default'
  static aiTradefiChatSettingsName = 'aiTradefi'

  static chatSettingsNames = [
    this.defaultChatSettingsName,
    this.aiTradefiChatSettingsName
  ]

  static chatSettings = [
    {
      name: this.defaultChatSettingsName,
      agentUniqueRef: BaseDataTypes.batchAgentRefId,
      isJsonMode: true
    },
    {
      name: this.aiTradefiChatSettingsName,
      agentUniqueRef: BaseDataTypes.aiTradefiAgentRefId,
      isJsonMode: false
    }
  ]

  // Exchange names
  static nasdaqExchangeName = 'NASDAQ'
  static nyseExchangeName = 'NYSE'

  static exchangeNames = [
    this.nasdaqExchangeName,
    this.nyseExchangeName
  ]

  // Trading types
  static buyTradeType = 'B'
  static sellTradeType = 'S'

  static tradeTypes = [
    this.buyTradeType,
    this.sellTradeType
  ]

  // Screener runs
  static instrumentsPerScreenerRun = 5  // 5 (testing), 10 (production)
  static maxScreenerRuns = 3

  // Default min score
  static defaultMinScore = 0.75

  // Trade analysis
  static tradeAnalysisEngineVersion = '1.0.0'

  // News sources
  static finnHubNewsSourceName = 'FinnHub'

  // Generations settings
  static defaultGenerationsSettingsName = 'Default'
}

export enum SlideTypes {
  annualFinancials = 'AFN',
  dailyChart = 'DCH',
  intro = 'INT',
  outro = 'OUT',
  quarterlyFinancials = 'QFN',
  requirements = 'REQ'
}
