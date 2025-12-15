import { DateUtilsService } from '@/services/utils/date-service'

// Services
const dateUtilsService = new DateUtilsService()

// Class
export class YFinanceToChartjsService {

  // Consts
  clName = 'YFinanceToChartjsService'

  // Code
  fromAnnualFinancials(finData: any) {

    // Debug
    const fnName = `${this.clName}.fromAnnualFinancials()`

    // console.log(`${fnName}: finData: ` + JSON.stringify(finData))

    // Get array data
    var labels: string[] = []
    var revenue: number[] = []
    var netincome: number[] = []

    for (const entry of finData[0].data) {

      const entryDate = new Date(entry.date)

      labels.push(dateUtilsService.formatDateDMonY(entryDate))
      revenue.push(entry.totalRevenue)
      netincome.push(entry.netIncome)
    }

    // Setup chartjs var
    const chartjs: any = {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Revenue',
            data: revenue,
            tension: 0.3,
            borderColor: '#2563eb',        // line color
            backgroundColor: '#2563eb33'   // fill (optional)
          },
          {
            label: 'Net income',
            data: netincome,
            tension: 0.3,
            borderColor: '#16a34a',
            backgroundColor: '#16a34a33'
          }
        ]
      }
    }

    // Return
    return JSON.stringify(chartjs)
  }

  fromDailyChart(finData: any) {

    // Debug
    const fnName = `${this.clName}.fromDailyChart()`

    // console.log(`${fnName}: finData: ` + JSON.stringify(finData))

    // Get array data
    var labels: string[] = []
    var closePrices: number[] = []

    for (const entry of finData[0].data.quotes) {

      const entryDate = new Date(entry.date)

      labels.push(dateUtilsService.formatDateDMonY(entryDate))
      closePrices.push(entry.adjclose)
    }

    // Setup chartjs var
    const chartjs: any = {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Close price',
            data: closePrices,
            tension: 0,                      // no smoothing for stock charts
            pointRadius: 0,                  // hide points for dense data
            borderColor: '#2563eb',        // line color
            backgroundColor: '#2563eb33'   // fill (optional)
          }
        ]
      }
    }

    // Return
    return JSON.stringify(chartjs)
  }

  fromQuarterlyFinancials(finData: any) {

    // Debug
    const fnName = `${this.clName}.fromQuarterlyFinancials()`

    // console.log(`${fnName}: finData: ` + JSON.stringify(finData))

    // Get array data
    var labels: string[] = []
    var revenue: number[] = []
    var netincome: number[] = []

    for (const entry of finData[0].data) {

      const entryDate = new Date(entry.date)

      labels.push(dateUtilsService.formatDateDMonY(entryDate))
      revenue.push(entry.totalRevenue)
      netincome.push(entry.netIncome)
    }

    // Setup chartjs var
    const chartjs: any = {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Revenue',
            data: revenue,
            tension: 0.3,
            borderColor: '#2563eb',        // line color
            backgroundColor: '#2563eb33'   // fill (optional)
          },
          {
            label: 'Net income',
            data: netincome,
            tension: 0.3,
            borderColor: '#16a34a',
            backgroundColor: '#16a34a33'
          }
        ]
      }
    }

    // Return
    return JSON.stringify(chartjs)
  }
}
