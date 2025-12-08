import { Typography } from '@mui/material'
import TradeAnalysisCard from './card'

interface Props {
  instanceId?: string
  tradeAnalyses: any[]
}

export default function ListTradeAnalyses({
                          instanceId,
                          tradeAnalyses
                        }: Props) {

  // Render
  return (
    <div style={{ marginBottom: '2em' }}>
      {tradeAnalyses != null ?
        <>
          {tradeAnalyses.length > 0 ?
            <>
              {tradeAnalyses.map(tradeAnalysis => (
                <TradeAnalysisCard
                  key={tradeAnalysis.id}
                  instanceId={instanceId}
                  tradeAnalysis={tradeAnalysis} />
              ))}
            </>
          :
            <Typography
              style={{ marginTop: '2em' }}
              variant='body1'>
              No trade analyses to list.
            </Typography>
          }
        </>
      :
        <></>
      }
    </div>
  )
}
