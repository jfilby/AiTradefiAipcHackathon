import { useScribe } from '@elevenlabs/react'
import { Button } from '@mui/material'

interface Props {
  token: string | undefined
  setText: any
  setToken: any
}

export default function StreamMicComponent({
                          token,
                          setText,
                          setToken
                        }: Props) {

  const scribe = useScribe({
    modelId: 'scribe_v2_realtime',
    onPartialTranscript: (data) => {
      // console.log('Partial:', data.text)
      setText(data.text)
    },
    onCommittedTranscript: (data) => {
      // console.log('Committed:', data.text)
      setText(data.text)
    },
    /* onCommittedTranscriptWithTimestamps: (data) => {
      console.log('Committed with timestamps:', data.text)
      console.log('Timestamps:', data.words)
      setText(data.text)
    }, */
  })

  const handleStart = async () => {

    // Connect to the scribe service
    await scribe.connect({
      token,
      microphone: {
        echoCancellation: true,
        noiseSuppression: true,
      },
    })
  }

  const handleStop = async () => {

    // Disconnect
    scribe.disconnect()

    // Unset the token
    setToken(undefined)
  }

  return (
    <div>
      <Button
        onClick={handleStart}
        disabled={scribe.isConnected || token == null}>
        Start Recording
      </Button>

      <Button
        onClick={handleStop}
        disabled={!scribe.isConnected || token == null}>
        Stop
      </Button>

      {/*
      {scribe.partialTranscript && <p>Live: {scribe.partialTranscript}</p>}

      <div>
        {scribe.committedTranscripts.map((t) => (
          <p key={t.id}>{t.text}</p>
        ))}
      </div>
      */}
    </div>
  )
}
