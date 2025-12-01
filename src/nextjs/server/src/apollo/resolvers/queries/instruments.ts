import { prisma } from '@/db'
import { InstrumentsQueryService } from '@/services/instruments/query-service'

// Services
const instrumentsQueryService = new InstrumentsQueryService()

// Code
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
