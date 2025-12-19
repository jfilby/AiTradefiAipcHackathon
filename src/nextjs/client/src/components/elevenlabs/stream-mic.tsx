import { useRef } from 'react'
import { useScribe } from '@elevenlabs/react'
import { Button } from '@mui/material'

interface Props {
  token: string | undefined
  text: string
  setText: any
  myMessageInput: React.RefObject<HTMLTextAreaElement | null>
  setToken: any
}

export default function StreamMicComponent({
                          token,
                          text,
                          setText,
                          myMessageInput,
                          setToken
                        }: Props) {

  // Store cusrsor start/end ref
  const cursorStartRef = useRef<number>(0)
  const cursorEndRef = useRef<number>(0)

  // ElevenLabs streaming
  const scribe = useScribe({
    modelId: 'scribe_v2_realtime',
    onPartialTranscript: (data) => {
      // console.log('Partial:', data.text)
      setText(setWithScribedText(data.text))
    },
    onCommittedTranscript: (data) => {
      // console.log('Committed:', data.text)
      setText(setWithScribedText(data.text))
    },
    /* onCommittedTranscriptWithTimestamps: (data) => {
      console.log('Committed with timestamps:', data.text)
      console.log('Timestamps:', data.words)
      setText(setWithScribedText(data.text))
    }, */
  })

  // Functions
  function setWithScribedText(scribedText: string) {
    const el = myMessageInput.current
    if (!el) return text.trimEnd() + (text ? ' ' : '') + scribedText

    const start = cursorStartRef.current
    const end = cursorEndRef.current

    // Split the existing text around the cursor/selection
    const before = text.slice(0, start)
    const after = text.slice(end)

    // Decide if we need a space
    const spaceBefore = before.length > 0 && !/\s$/.test(before) ? ' ' : ''
    const spaceAfter = after.length > 0 && !/^\s/.test(after) ? ' ' : ''

    // Combine
    const newText = before + spaceBefore + scribedText + spaceAfter + after

    return newText
  }

  const handleStart = async () => {

    // Save cursor start/end
    const el = myMessageInput.current

    if (el) {
      cursorStartRef.current = el.selectionStart ?? el.value.length
      cursorEndRef.current = el.selectionEnd ?? el.value.length
    }

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
