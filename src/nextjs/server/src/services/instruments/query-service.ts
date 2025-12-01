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
          type: string) {

    // Get instruments
    const instruments = await
            instrumentModel.filter(
              prisma,
              undefined,
              type)

    // Return
    return {
      status: true,
      instruments: instruments
    }
  }
}
