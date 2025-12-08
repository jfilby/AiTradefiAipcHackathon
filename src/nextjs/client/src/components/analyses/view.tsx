import { useState } from 'react'
import { Alert, Divider, Typography } from '@mui/material'

interface Props {
  instanceId?: string
  analysis: any
}

export default function ViewAnalysis({
                          instanceId,
                          analysis
                        }: Props) {

  // Consts
  const pathsUrl = `/i/${instanceId}/analyses/${analysis.id}`

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

      <div style={{ marginBottom: '2em' }}>
        <div style={{ display: 'block', marginBottom: '1em' }}>

          <div style={{ background: '#ddffdd', marginBottom: '2em', padding: '0.5em' }}>
            <Typography
              style={{ display: 'inline-block' }}
              variant='h5'>
              {analysis.name}
            </Typography>

            <Typography
              style={{ display: 'inline-block', float: 'right', marginTop: '0.5em' }}
              variant='body2'>

              <span>
                {(new Date(parseInt(analysis.updated))).toDateString()}
              </span>
            </Typography>
          </div>

        </div>
      </div>
    </div>
  )
}
