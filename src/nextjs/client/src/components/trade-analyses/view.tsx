import { useState } from 'react'
import { Alert, Divider, Typography } from '@mui/material'

interface Props {
  instanceId?: string
  tradeAnalysis: any
}

export default function ViewTradeAnalysis({
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

          <Typography variant='h6'>
            {tradeAnalysis.instrument.name}:{tradeAnalysis.instrument.exchange.name}
          </Typography>

          <Typography variant='body1'>
            {tradeAnalysis.thesis}
          </Typography>
        </div>
      </div>

      <Divider
        variant='fullWidth'
        style={{ marginBottom: '1em' }} />
    </div>
  )
}
