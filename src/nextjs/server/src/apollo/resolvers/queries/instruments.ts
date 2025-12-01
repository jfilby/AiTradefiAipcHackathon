import { prisma } from '@/db'
import { InstrumentsQueryService } from '@/services/instruments/query-service'

// Services
const instrumentsQueryService = new InstrumentsQueryService()

// Code
export async function getInstrumentById(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  // Debug
  const fnName = `getInstrument()`

  // Get instruments
  const instrumentsResults = await
          instrumentsQueryService.getById(
            prisma,
            args.instrumentId)

  // Return
  return instrumentsResults.instrument
}

export async function getInstruments(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  // Debug
  const fnName = `getInstruments()`

  // Get instruments
  const instrumentsResults = await
          instrumentsQueryService.getAll(
            prisma,
            args.type)

  // Return
  return instrumentsResults.instruments
}
