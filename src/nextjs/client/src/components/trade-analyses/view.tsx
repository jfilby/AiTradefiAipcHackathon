import FinancialChart from '../slides/financial-chart'

interface Props {
  dailyChart: any
  annualFinancials: any
  quarterlyFinancials: any
}

export default function ViewTradeAnalysis({
                          dailyChart,
                          annualFinancials,
                          quarterlyFinancials
                        }: Props) {

  // Render
  return (
    <div style={{ height: '80vh', marginBottom: '2em', minWidth: 275 }}>

      {/* Charts */}
      {dailyChart != null ?
        <FinancialChart
          chartData={dailyChart} />
        :
        <></>
      }

      {annualFinancials != null ?
        <FinancialChart
          chartData={annualFinancials} />
        :
        <></>
      }

      {quarterlyFinancials != null ?
        <FinancialChart
          chartData={quarterlyFinancials} />
        :
        <></>
      }
    </div>
  )
}
