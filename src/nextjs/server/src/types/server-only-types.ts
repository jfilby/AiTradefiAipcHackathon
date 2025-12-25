export class ServerOnlyTypes {

  // Document categories
  static generalNewsCategory = 'N'

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
  static instrumentsPass1Factor = 1.5
  static maxScreenerRuns = 1

  // Default min score
  static defaultMinScore = 0.75

  // Trade analysis
  static tradeAnalysisEngineVersion = '1.0.0'

  // News sources
  static finnHubNewsSourceName = 'FinnHub'

  // Generations settings
  static defaultGenerationsConfigName = 'Default'

  static defaultSlideShowConfig = {
    withIntroImage: false,
    requirementsSlide: true,
    withAudioNarration: true,
  }
  
  static defaultVideoConfig = {
    withIntroImage: false,
    requirementsIntro: true,
    withAudioNarration: true,
  }
}

export enum UserPreferenceCategories {
  audioCategory = 'audio'
}

export enum UserPreferenceKeys {
  chatSpeakKey = 'chat speak'
}

export enum ChatPages {
  analysisPageChat = 'analysis page chat'
}

export interface ChatSessionOptions {
  page?: string
}

export enum CurrencyCodes {
  gbp = 'GBP',
  usd = 'USD',
  zar = 'ZAR'
}

export enum SlideTypes {
  annualFinancials = 'AFN',
  dailyChart = 'DCH',
  intro = 'INT',
  outro = 'OUT',
  quarterlyFinancials = 'QFN',
  requirements = 'REQ'
}
