import { useState } from 'react'
import { Alert, Link, Typography } from '@mui/material'

interface Props {
  instanceId?: string
  tradeAnalysis: any
}

export default function TradeAnalysisCard({
                          instanceId,
                          tradeAnalysis
                        }: Props) {

  // Consts
  const tradeAnalysisUrl = `/results/${tradeAnalysis.id}`

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
        <Link href={tradeAnalysisUrl}>
          <div style={{ display: 'block', marginBottom: '1em' }}>

            <div style={{ marginBottom: '0.5em' }}>

              <Typography
                sx={{
                  display: 'inline-block',
                  marginBottom: '0.5em',
                  '&:hover': { textDecoration: 'underline' },
                }}
                variant='h5'>
                {tradeAnalysis.instrument.name}
              </Typography>

              <Typography
                style={{ display: 'inline-block', marginLeft: '0.5em', width: '50%' }}
                variant='body2'>

                <span>
                  {tradeAnalysis.instrument.exchange.name}
                </span>
                <span style={{ color: '#660', marginLeft: '1em' }}>
                  {Math.floor(tradeAnalysis.score * 100)}%
                </span>
              </Typography>
            </div>

            <div style={{ marginBottom: '0.5em' }}>
              <Typography variant='body1'>
                {tradeAnalysis.thesis}
              </Typography>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
