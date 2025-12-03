import { Typography } from '@mui/material'
import ViewTradeAnalysesGroup from './view'

interface Props {
  instanceId?: string
  tradeAnalysesGroups: any[]
}

export default function ListTradeAnalysesGroups({
                          instanceId,
                          tradeAnalysesGroups
                        }: Props) {

  // Render
  return (
    <div style={{ marginBottom: '2em' }}>
      {tradeAnalysesGroups != null ?
        <>
          {tradeAnalysesGroups.length > 0 ?
            <>
              {tradeAnalysesGroups.map(tradeAnalysesGroup => (
                <ViewTradeAnalysesGroup
                  tradeAnalysesGroup={tradeAnalysesGroup} />
              ))}
            </>
          :
            <Typography
              style={{ marginTop: '2em' }}
              variant='body1'>
              No trade analyses groups to list.
            </Typography>
          }
        </>
      :
        <></>
      }
    </div>
  )
}
