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

          <div style={{ marginBottom: '1em' }}>
            <Typography
              style={{ display: 'inline-block' }}
              variant='h5'>
              {(new Date(parseInt(tradeAnalysesGroup.day))).toDateString()}
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

      <Divider
        variant='fullWidth'
        style={{ marginBottom: '1em' }} />
    </div>
  )
}
