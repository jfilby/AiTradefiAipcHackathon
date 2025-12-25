import { useState } from 'react'
import { Alert, Link, Typography } from '@mui/material'
import { BaseDataTypes } from '@/shared/types/base-data-types'

interface Props {
  userProfileId: string
  instanceId?: string
  elevenLabsVoice: any
}

export default function ElevenLabsVoiceCard({
                          userProfileId,
                          instanceId,
                          elevenLabsVoice
                        }: Props) {

  // Consts
  const viewUrl = `/elevenLabsVoice/${elevenLabsVoice.id}`

  // State
  const [alertSeverity, setAlertSeverity] = useState<any>('')
  const [message, setMessage] = useState<string | undefined>(undefined)
  const [thisElevenLabsVoice, setThisElevenLabsVoice] = useState<any>(elevenLabsVoice)

  // Render
  return (
    <div style={{ marginBottom: '2em', minWidth: 275 }}>

      {message != null ?
        <Alert
          severity={alertSeverity}
          style={{ marginBottom: '2em' }}>
          {message}
        </Alert>
      :
        <></>
      }

      {/*<p>elevenLabsVoice: {JSON.stringify(elevenLabsVoice)}</p>*/}

      <div style={{ marginBottom: '2em' }}>

        <div
          onClick={(e) => window.location.href = viewUrl}
          style={{ display: 'inline-block', marginBottom: '1em', width: '80%' }}>

          {thisElevenLabsVoice.status === BaseDataTypes.activeStatus ?
            <Link href={viewUrl}>
              <a style={{ textDecoration: 'none', color: 'inherit' }}>
                <Typography
                  variant='h6'
                  sx={{
                    display: 'inline-block',
                    marginBottom: '0.5em',
                    '&:hover': { textDecoration: 'underline' },
                  }}>
                  {thisElevenLabsVoice.name}
                </Typography>
              </a>
            </Link>
          :
            <>
            </>
          }

          <Typography variant='body1'>
            {elevenLabsVoice.description}
          </Typography>

        </div>
      </div>
    </div>
  )
}
