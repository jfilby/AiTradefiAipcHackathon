import { ServerOnlyTypes } from './server-only-types'

export class TradingParameterTypes {

  // Stocks to analyze
  static aaplSymbol = 'AAPL'
  static amdSymbol = 'AMD'
  static amznSymbol = 'AMZN'
  static nvdaSymbol = 'NVDA'
  static tslaSymbol = 'TSLA'

  // Small cap
  static brtxSymbol = 'BRTX'
  static dghiSymbol = 'DGHI'

  static nasdaqStocks = [
    {
      symbol: this.aaplSymbol,
      type: ServerOnlyTypes.stockType,
      name: 'Apple'
    },
    {
      symbol: this.amdSymbol,
      type: ServerOnlyTypes.stockType,
      name: 'AMD'
    },
    {
      symbol: this.amznSymbol,
      type: ServerOnlyTypes.stockType,
      name: 'Amazon'
    },
    {
      symbol: this.nvdaSymbol,
      type: ServerOnlyTypes.stockType,
      name: 'Nvidia'
    },
    {
      symbol: this.tslaSymbol,
      type: ServerOnlyTypes.stockType,
      name: 'Tesla'
    },
    {
      symbol: this.brtxSymbol,
      type: ServerOnlyTypes.stockType,
      name: 'BioRestorative Therapies'
    },
    {
      symbol: this.dghiSymbol,
      type: ServerOnlyTypes.stockType,
      name: 'Digihost Technology'
    }
  ]

  // Window types
  static ultraShortWindowTypeName = 'Ultra-short'
  static shortWindowTypeName = 'Short'
  static mediumWindowTypeName = 'Medium'
  static longWindowTypeName = 'Long'

  static defaultWindowTypes = [
    {
      name: this.ultraShortWindowTypeName,
      fromTimeUnit: 'H',
      fromTimeValue: 0,
      toTimeUnit: 'H',
      toTimeValue: 6
    },
    {
      name: this.shortWindowTypeName,
      fromTimeUnit: 'D',
      fromTimeValue: 1,
      toTimeUnit: 'D',
      toTimeValue: 3
    },
    {
      name: this.mediumWindowTypeName,
      fromTimeUnit: 'D',
      fromTimeValue: 7,
      toTimeUnit: 'D',
      toTimeValue: 30
    },
    {
      name: this.longWindowTypeName,
      fromTimeUnit: 'D',
      fromTimeValue: 30,
      toTimeUnit: 'D',
      toTimeValue: 365
    }    
  ]

  // Category weighting per window (based on Claude.ai recommendations)
  static defaultCategoryWeightingPerWindow = {
    [this.ultraShortWindowTypeName]: {
      newsPct: 0.45,
      technicalsPct: 0.30,
      filingsPct: 0.15,
      socialSentimentPct: 0.10,
      earningsPct: 0.0,
      fundamentalsPct: 0.0
    },
    [this.shortWindowTypeName]: {
      newsPct: 0.40,
      technicalsPct: 0.35,
      filingsPct: 0.15,
      socialSentimentPct: 0.05,
      earningsPct: 0.05,
      fundamentalsPct: 0.0
    },
    [this.mediumWindowTypeName]: {
      windowDaysMin: 7, 
      windowDaysMax: 30,
      newsPct: 0.25,
      technicalsPct: 0.20,
      filingsPct: 0.25,
      socialSentimentPct: 0.05,
      earningsPct: 0.20,
      fundamentalsPct: 0.05
    },
    [this.longWindowTypeName]: {
      newsPct: 0.10,
      technicalsPct: 0.15,
      filingsPct: 0.20,
      socialSentimentPct: 0.0,
      earningsPct: 0.25,
      fundamentalsPct: 0.30
    }
  }

  // News weighting
  static defaultNewsWeightingByWindowType = {
    [this.ultraShortWindowTypeName]: {  // e.g. scalping, intraday (minutes to 1 hour)
      sentimentScore: 0.3,
      confidenceScore: 0.1,
      potencyScore: 0.1,
      noveltyScore: 0.2,
      urgencyScore: 0.3
    },
  
    [this.shortWindowTypeName]: {  // e.g. day trading or 1–2 days
      sentimentScore: 0.35,
      confidenceScore: 0.15,
      potencyScore: 0.15,
      noveltyScore: 0.15,
      urgencyScore: 0.2
    },
  
    [this.mediumWindowTypeName]: {  // e.g. swing trading (2 days to 2 weeks)
      sentimentScore: 0.4,
      confidenceScore: 0.2,
      potencyScore: 0.15,
      noveltyScore: 0.15,
      urgencyScore: 0.1
    },
  
    [this.longWindowTypeName]: {  // e.g. position trading or long-term investing (weeks to months+)
      sentimentScore: 0.4,
      confidenceScore: 0.25,
      potencyScore: 0.2,
      noveltyScore: 0.1,
      urgencyScore: 0.05
    }
  }

  // Multiply base weights by these factors based on conditions
  static defaultAdjustmentFactors = {
    highVolatility: { ultraShort: 1.2, short: 1.1, medium: 0.9, long: 0.8 },
    earningsSeason: { medium: 1.3, short: 0.9 },
    lowNewsFlow: { technical: 1.2, news: 0.8 }
  }

  // Weighting category windows per trading style
  static defaultWeightingCategoryWindowsByTradingStyle = {
    dayTrading: {
      ultraShortWindowMin: 0.25,
      ultraShortWindowMax: 0.35,
      shortWindowMin: 0.45,
      shortWindowMax: 0.55,
      mediumWindowMin: 0.10,
      mediumWindowMax: 0.20,
      longWindowMin: 0.0,
      longWindowMax: 0.05
    },
    swingTrading: {
      ultraShortWindowMin: 0.10,
      ultraShortWindowMax: 0.20,
      shortWindowMin: 0.35,
      shortWindowMax: 0.45,
      mediumWindowMin: 0.30,
      mediumWindowMax: 0.40,
      longWindowMin: 0.10,
      longWindowMax: 0.20
    },
    positionTrading: {
      ultraShortWindowMin: 0.0,
      ultraShortWindowMax: 0.10,
      shortWindowMin: 0.15,
      shortWindowMax: 0.25,
      mediumWindowMin: 0.25,
      mediumWindowMax: 0.35,
      longWindowMin: 0.35,
      longWindowMax: 0.50
    }
  }
}
