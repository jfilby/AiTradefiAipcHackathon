import { useState } from 'react'
import { Alert, Divider } from '@mui/material'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import LabeledIconButton from '@/serene-core-client/components/buttons/labeled-icon-button'

interface Props {
  instanceId?: string
  instrument: any
}

export default function ViewInstrument({
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

          {instrument.isDirectory ?
            <LabeledIconButton
              icon={AccountTreeIcon}
              label={instrument.part}
              onClick={(e: any) => window.location.href = pathsUrl} />
          :
            <LabeledIconButton
              icon={AccountTreeIcon}
              label={instrument.part}
              onClick={undefined} />
          }
        </div>
      </div>

      <Divider
        variant='fullWidth'
        style={{ marginBottom: '1em' }} />
    </div>
  )
}
