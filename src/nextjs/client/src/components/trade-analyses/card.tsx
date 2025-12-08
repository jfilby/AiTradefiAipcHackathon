import { useState } from 'react'
import { Alert, Divider, Typography } from '@mui/material'

interface Props {
  instanceId?: string
  tradeAnalysis: any
}

export default function TradeAnalysisCard({
                          instanceId,
                          tradeAnalysis
                        }: Props) {

  // Consts
  const pathsUrl = `/i/${instanceId}/trade-analysis/${tradeAnalysis.id}`

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

      {/*<p>tradeAnalysis: {JSON.stringify(tradeAnalysis)}</p>*/}

      <div style={{ marginBottom: '2em' }}>
        <div style={{ display: 'block', marginBottom: '1em' }}>

          <div style={{ marginBottom: '0.5em' }}>
            <Typography
              style={{ display: 'inline-block' }}
              variant='h6'>
              {tradeAnalysis.instrument.name}
            </Typography>

            <Typography
              style={{ display: 'inline-block', marginLeft: '0.5em', width: '50%' }}
              variant='body2'>

              <span>
                {tradeAnalysis.instrument.exchange.name}
              </span>
              <span style={{ color: '#660', marginLeft: '1em' }}>
                {tradeAnalysis.score * 100}%
              </span>
            </Typography>
          </div>

          <div style={{ marginBottom: '0.5em' }}>
            <Typography variant='body1'>
              {tradeAnalysis.thesis}
            </Typography>
          </div>
        </div>
      </div>

      <Divider
        variant='fullWidth'
        style={{ marginBottom: '1em' }} />
    </div>
  )
}
