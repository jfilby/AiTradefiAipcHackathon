import { WindowType } from '@prisma/client'
import { WindowTypeModel } from '@/models/instruments/window-type-model'

// Models
const windowTypeModel = new WindowTypeModel()

// Class
export class WindowTypesService {

  // Consts
  clName = 'WindowTypesService'

  // Code
  getHistoricalDate(windowType: WindowType) {

    // Get historical date
    const now = new Date()
    const pastDate = new Date(now)

    switch (windowType.toTimeUnit) {
      case 'H':
        pastDate.setHours(now.getHours() - windowType.toTimeValue)
        break
      case 'D':
        pastDate.setDate(now.getDate() - windowType.toTimeValue)
        break
      default:
        throw new Error(`Unsupported time unit: ${windowType.toTimeUnit}`)
    }

    return pastDate
  }
}
