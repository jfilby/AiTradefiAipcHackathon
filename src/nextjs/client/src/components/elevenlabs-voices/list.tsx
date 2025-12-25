import { Typography } from '@mui/material'
import ElevenLabsVoiceCard from './card'

interface Props {
  userProfileId: string
  instanceId?: string
  elevenLabsVoices: any[]
}

export default function ListElevenLabsVoices({
                          userProfileId,
                          instanceId,
                          elevenLabsVoices
                        }: Props) {

  // Render
  return (
    <div style={{ marginBottom: '2em' }}>
      {elevenLabsVoices != null ?
        <>
          <Typography
            variant='h6'>
            ElevenLabs voice
          </Typography>
          {elevenLabsVoices.length > 0 ?
            <>
              {elevenLabsVoices.map(elevenLabsVoice => (
                <ElevenLabsVoiceCard
                  userProfileId={userProfileId}
                  elevenLabsVoice={elevenLabsVoice} />
              ))}
            </>
          :
            <Typography
              style={{ marginTop: '2em' }}
              variant='body1'>
              No configs to list.
            </Typography>
          }
        </>
      :
        <></>
      }
    </div>
  )
}
