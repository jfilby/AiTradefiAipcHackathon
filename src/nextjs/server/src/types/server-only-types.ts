import { BaseDataTypes } from '@/shared/types/base-data-types'

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

  // Instrument types
  static stockType = 'stock'

  // Trading types
  static buyTradingType = 'B'
  static sellTradingType = 'S'

  static tradingTypes = [
    this.buyTradingType,
    this.sellTradingType
  ]

  // News sources
  static finnHubNewsSourceName = 'FinnHub'
}
