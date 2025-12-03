import { PrismaClient } from '@prisma/client'
import { InstrumentModel } from '@/models/instruments/instrument-model'

// Models
const instrumentModel = new InstrumentModel()

// Class
export class InstrumentsQueryService {

  // Consts
  clName = 'InstrumentsQueryService'

  // Code
  async getAll(
          prisma: PrismaClient,
          status: string,
          type: string) {

    // Get instruments
    const instruments = await
            instrumentModel.filter(
              prisma,
              undefined,  // exchangeId
              status,
              type)

    // Return
    return {
      status: true,
      instruments: instruments
    }
  }

  async getById(
          prisma: PrismaClient,
          instrumentId: string) {

    // Get instrument
    const instrument = await
            instrumentModel.getById(
              prisma,
              instrumentId)

    // Return
    return {
      status: true,
      instrument: instrument
    }
  }
}
