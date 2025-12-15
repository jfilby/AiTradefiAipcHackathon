import { CustomError } from '@/serene-core-server/types/errors'

export class CurrencyUtilsService {

  // Consts
  clName = 'CurrencyUtilsService'

  // Code
  getCurrencySymbol(code: string): string {

    // Debug
    const fnName = `${this.clName}.getCurrencySymbol()`

    // console.log(`${fnName}: code: ${code}`)

    // Validate
    if (code == null) {
      throw new CustomError(`${fnName}: code == null`)
    }

    // Use the built-in NumberFormat
    const formatter = new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })

    // The formatted string includes the symbol + amount, so strip digits
    return formatter.format(0).replace(/\d/g, '').trim()
  }
}
