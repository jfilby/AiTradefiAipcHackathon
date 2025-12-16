import { Line } from 'react-chartjs-2'
import '@/components/chartjs/chartjs'
import { formatAbbreviatedNumber } from '../chartjs/format-numbers'

interface Props {
  chartData: any
}

export default function FinancialChart({
                          chartData
                        }: Props) {

  // Render
  return (
    <div style={{ marginBottom: '1em' }}>
      <Line
        datasetIdKey='id'
        data={chartData.data}
        options={{
          interaction: { mode: 'index', intersect: false },
          scales: {
            y: {
              ticks: {
                callback: (value) =>
                  formatAbbreviatedNumber(
                    value,
                    { currency: chartData.currencySymbol })
              }
            }
          },
          // Disable animations:
          // - Better for financial charts where correctness is important
          // - The Notes dialog reanimates some lines when opening/closing
          animation: false
        }} />
    </div>
  )
}
