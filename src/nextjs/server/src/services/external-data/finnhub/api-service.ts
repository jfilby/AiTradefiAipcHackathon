const finnhub = require('finnhub')
import { PrismaClient } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { FinnhubApiDetails } from '@/types/finnhub-types'
import { DocumentModel } from '@/models/documents/document-model'

// FinnHub client
const finnhubClient = new finnhub.DefaultApi(FinnhubApiDetails.apiKey)

// Models
const documentModel = new DocumentModel()

// Class
export class FinnHubApiService {

  // Consts
  clName = 'FinnHubApiService'

  // Code
  formatDateToYYYYMMDD(date: Date): string {

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')  // months are 0-based
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  async getComanyNews(
          prisma: PrismaClient,
          docSourceId: string,
          symbol: string,
          from: Date,
          to: Date) {

    // Debug
    const fnName = `${this.clName}.getComanyNews()`

    // Validate
    if (docSourceId == null) {
      throw new CustomError(`${fnName}: docSourceId == null`)
    }

    if (symbol == null) {
      throw new CustomError(`${fnName}: symbol == null`)
    }

    if (from == null) {
      throw new CustomError(`${fnName}: from == null`)
    }

    if (to == null) {
      throw new CustomError(`${fnName}: to == null`)
    }

    // Get from the API
    const results: any[] = await new Promise((resolve, reject) => {
      finnhubClient.companyNews(
        symbol,
        this.formatDateToYYYYMMDD(from),
        this.formatDateToYYYYMMDD(to),
        (error: any, data: any, response: any) => {
          if (error) return reject(error)
          resolve(data)
        }
      )
    })

    // Debug
    console.log(`${fnName}: results for ${symbol}: ${results.length}`)

    // Save
    for (const result of results) {

      var instruments: string[] = []

      if (typeof result.related === 'string') {
        instruments = [result.related]

      } else if (Array.isArray(result.related)) {
        instruments = result.related
      }

      const document = await
              documentModel.upsert(
                prisma,
                undefined,       // id
                docSourceId,
                result.id.toString(),
                result.headline,
                result.source,
                result.url,
                result.summary,  // text
                instruments,
                new Date(result.datetime * 1000))
    }

    // Return
    return results
  }

  async getMarketNews(prisma: PrismaClient) {

    ;
  }

  async getSecFilings(prisma: PrismaClient) {

    ;
  }
}
