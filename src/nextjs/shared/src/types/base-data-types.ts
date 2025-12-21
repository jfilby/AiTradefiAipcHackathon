export class BaseDataTypes {

  // Statuses
  static activeStatus = 'A'
  static deletePendingStatus = 'P'
  static failedStatus = 'F'
  static newStatus = 'N'
  static inactiveStatus = 'I'

  static statusMap = {
    [this.activeStatus]: 'Active',
    [this.deletePendingStatus]: 'Delete pending'
  }

  static statusArray = [
    {
      value: this.activeStatus,
      name: 'Active'
    },
    {
      value: this.deletePendingStatus,
      name: 'Delete pending'
    }
  ]

  // Analysis record statuses
  static analysisStatusMap = {
    [this.activeStatus]: 'Published',
    [this.newStatus]: 'Draft',
    [this.deletePendingStatus]: 'Delete pending'
  }

  // Agents
  static batchAgentRefId = 'Batch'
  static batchAgentName = 'Batch'
  static batchAgentRole = 'Batch processing'

  static aiTradefiAgentRefId = 'AiTradefi'
  static aiTradefiAgentName = 'AiTradefi'
  static aiTradefiAgentRole = 'Talk to users'

  static agents = [
    {
      agentRefId: this.batchAgentRefId,
      agentName: this.batchAgentName,
      agentRole: this.batchAgentRole
    },
    {
      agentRefId: this.aiTradefiAgentRefId,
      agentName: this.aiTradefiAgentName,
      agentRole: this.aiTradefiAgentRole
    }
  ]

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
      agentUniqueRef: this.batchAgentRefId,
      isJsonMode: true
    },
    {
      name: this.aiTradefiChatSettingsName,
      agentUniqueRef: this.aiTradefiAgentRefId,
      isJsonMode: true
    }
  ]

  // Instrument types
  static stocksType = 'stocks'
  static cryptoType = 'crypto'

  static allInstrumentTypes = [
    // this.cryptoType,
    this.stocksType
  ]

  static instrumentTypesMap = {
    [this.stocksType]: 'Stocks'
  }

  static instrumentTypesArray = [
    {
      value: this.stocksType,
      name: 'Stocks'
    }
  ]

  // Analysis types
  static evaluatorType = 'E'
  static screenerType = 'S'
}
