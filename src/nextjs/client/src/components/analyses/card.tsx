import { useState } from 'react'
import { Alert, Divider, Link, Typography } from '@mui/material'

interface Props {
  instanceId?: string
  analysis: any
}

export default function AnalysisCard({
                          instanceId,
                          analysis
                        }: Props) {

  // Consts
  const viewUrl = `/i/analysis/${analysis.id}`

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

      {/*<p>analysis: {JSON.stringify(analysis)}</p>*/}

      <div
        onClick={(e) => window.location.href = viewUrl}
        style={{ marginBottom: '2em' }}>

        <div style={{ display: 'block', marginBottom: '1em' }}>

          <Link href={viewUrl}>
            <Typography
              style={{ marginBottom: '0.5em' }}
              variant='h5'>
              {analysis.name}
            </Typography>
          </Link>

          <Typography variant='body1'>
            {analysis.description}
          </Typography>

        </div>
      </div>

      <Divider variant='fullWidth' />
    </div>
  )
}
