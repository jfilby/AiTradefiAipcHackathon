import { useState } from 'react'
import { Alert, Divider, Typography } from '@mui/material'

interface Props {
  instanceId?: string
  instrument: any
}

export default function InstrumentCard({
                          instanceId,
                          instrument
                        }: Props) {

  // Consts
  const pathsUrl = `/i/${instanceId}/instruments/${instrument.id}`

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

      {/*<p>instrument: {JSON.stringify(instrument)}</p>*/}

      <div style={{ marginBottom: '2em' }}>
        <div style={{ display: 'block', marginBottom: '1em' }}>

          <Typography variant='h6'>
            {instrument.name}
          </Typography>
        </div>
      </div>

      <Divider
        variant='fullWidth'
        style={{ marginBottom: '1em' }} />
    </div>
  )
}
