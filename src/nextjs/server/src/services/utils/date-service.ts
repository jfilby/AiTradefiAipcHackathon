export class DateUtilsService {

  // Consts
  clName = 'DateUtilsService'

  // Code
  formatDateDMonY(date: Date): string {

    const parts = new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).formatToParts(date)

    const map = Object.fromEntries(parts.map(p => [p.type, p.value]))
    return `${map.day}-${map.month}-${map.year}`
  }
}
