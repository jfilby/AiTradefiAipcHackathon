import { useState } from 'react'
import { Alert, Divider, Typography } from '@mui/material'
import ListTradeAnalyses from '../trade-analyses/list'

interface Props {
  instanceId?: string
  tradeAnalysesGroup: any
}

export default function ViewTradeAnalysesGroup({
                          instanceId,
                          tradeAnalysesGroup
                        }: Props) {

  // Consts
  const pathsUrl = `/i/${instanceId}/trade-analysis-group/${tradeAnalysesGroup.id}`

  // State
  const [alertSeverity, setAlertSeverity] = useState<any>('')
  const [message, setMessage] = useState<string | undefined>(undefined)

  // Render
  return (
    <div style={{ minWidth: 275 }}>

      {message != null ?
        <Alert
          severity={alertSeverity}
          style={{ marginBottom: '2em' }}>
          {message}
        </Alert>
      :
        <></>
      }

      {/*<p>tradeAnalysesGroup: {JSON.stringify(tradeAnalysesGroup)}</p>*/}

      <div style={{ marginBottom: '2em' }}>
        <div style={{ display: 'block', marginBottom: '1em' }}>

          <div style={{ background: '#ddffdd', marginBottom: '2em', padding: '0.5em' }}>
            <Typography
              style={{ display: 'inline-block' }}
              variant='h5'>
              {tradeAnalysesGroup.analysis.name}
            </Typography>

            <Typography
              style={{ display: 'inline-block', float: 'right', marginTop: '0.5em' }}
              variant='body2'>

              <span>
                {(new Date(parseInt(tradeAnalysesGroup.day))).toDateString()}
              </span>
            </Typography>
          </div>

          <div>
            <ListTradeAnalyses
              key={tradeAnalysesGroup.id}
              instanceId={instanceId}
              tradeAnalyses={tradeAnalysesGroup.ofTradeAnalyses} />
          </div>
        </div>
      </div>
    </div>
  )
}
