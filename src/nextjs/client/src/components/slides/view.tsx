import { useEffect, useRef, useState } from 'react'
import { Alert, Typography } from '@mui/material'
import { Image } from 'mui-image'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import FinancialChart from './financial-chart'

interface Props {
  userProfileId: string
  instanceId?: string
  slideshow: any
  slide: any
  setSlide: any
  replayAudio: boolean
  setReplayAudio: any
  muteAudio: boolean
  setMuteAudio: any
}

export default function ViewSlide({
                          userProfileId,
                          instanceId,
                          slideshow,
                          slide,
                          setSlide,
                          replayAudio,
                          setReplayAudio,
                          muteAudio,
                          setMuteAudio
                        }: Props) {

  // Const
  const imageUrl = slide.generatedImageId ?
    `${process.env.NEXT_PUBLIC_API_URL}/api/image/${slide.generatedImageId}/get` :
    undefined

  const annualFinancials = slide.annualFinancials ?          
    JSON.parse(slide.annualFinancials) :
    undefined

  const quarterlyFinancials = slide.quarterlyFinancials ?          
    JSON.parse(slide.quarterlyFinancials) :
    undefined

  const dailyChart = slide.dailyChart ?          
    JSON.parse(slide.dailyChart) :
    undefined

  // Use a reduced text size if an image is present
  const textVariant = 'h5'

  // State
  const [alertSeverity, setAlertSeverity] = useState<any>('')
  const [message, setMessage] = useState<string | undefined>(undefined)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [undeleteDialogOpen, setUndeleteDialogOpen] = useState(false)
  const [deleteAction, setDeleteAction] = useState(false)
  const [undeleteAction, setUndeleteAction] = useState(false)
  const [saveAction, setSaveAction] = useState(false)

  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Functions
  function fadeOutAndStop(duration = 200): Promise<void> {
    return new Promise(resolve => {
      const audio = audioRef.current
      if (!audio) return resolve()

      const startVolume = audio.volume
      const steps = duration / 20
      let currentStep = 0

      const interval = setInterval(() => {
        currentStep++
        audio.volume = Math.max(
          0,
          startVolume * (1 - currentStep / steps)
        )

        if (currentStep >= steps) {
          clearInterval(interval)
          audio.pause()
          audio.currentTime = 0
          audio.volume = startVolume
          resolve()
        }
      }, 20)
    })
  }

  async function playAudio() {

    // console.log(`playing audio..`)

    // Stop any existing audio
    fadeOutAndStop()

    // Return if no validation
    if (slide.narration == null) {
      return
    }

    // Wait function
    const wait = (ms: number) => new Promise(res => setTimeout(res, ms))

    // Process narration
    var prevSentenceIndex = 0
    var prevPauseMs = 0

    for (const narrationSegment of slide.narration) {

      // Get the URL
      const audioUrl = narrationSegment.generatedAudioId ?
        `${process.env.NEXT_PUBLIC_API_URL}/api/audio/${narrationSegment.generatedAudioId}/get` :
        undefined

      // Skip if audio URL not found
      if (!audioUrl) continue

      // Pause before new sentence?
      if (narrationSegment.sentenceIndex > prevSentenceIndex &&
          prevPauseMs == null ||
          prevPauseMs === 0) {

        wait(300)
      }

      // Play segment's audio
      await new Promise<void>((resolve, reject) => {
        const audio = new Audio(audioUrl)
        audioRef.current = audio

        audio.addEventListener('ended', () => resolve(), { once: true })
        audio.addEventListener('error', (e) => reject(e), { once: true })

        audio.play().catch(reject)
      })

      // Pause after?
      if (narrationSegment.pauseMsAfter != null) {
        await wait(narrationSegment.pauseMsAfter)
      }

      // Set prevSentenceIndex
      prevSentenceIndex = narrationSegment.sentenceIndex
      prevPauseMs = narrationSegment.pauseMsAfter
    }
  }

  function stopAudio() {
    if (!audioRef.current) return

    audioRef.current.pause()
    audioRef.current.currentTime = 0
  }

  // Effects
  useEffect(() => {

    if (muteAudio === false) {

      playAudio()
    }

  }, [slide])

  useEffect(() => {

    if (replayAudio === false ||
        muteAudio === true) {

      return
    }

    playAudio()
    setReplayAudio(false)

  }, [slide, replayAudio])

  useEffect(() => {

    if (muteAudio === false) {
      return
    }

    fadeOutAndStop()

  }, [slide, muteAudio])

  useEffect(() => {

    if (deleteAction === true) {

      slide.status = BaseDataTypes.deletePendingStatus
      setSlide(slide)
      setSaveAction(true)
      setDeleteAction(false)
    }

  }, [deleteAction])

  useEffect(() => {

    if (undeleteAction === true) {

      slide.status = BaseDataTypes.activeStatus
      setSlide(slide)
      setSaveAction(true)
      setUndeleteAction(false)
    }

  }, [undeleteAction])

  // Render
  return (
    <div style={{ height: '80vh', marginBottom: '2em', minWidth: 275 }}>

      {message != null ?
        <Alert
          severity={alertSeverity}
          style={{ marginBottom: '2em' }}>
          {message}
        </Alert>
      :
        <></>
      }

      {/* <p>slide: {JSON.stringify(slide)}</p> */}

      {/* Sldie title */}
      <div style={{ marginBottom: '2em' }}>
        <div style={{ marginBottom: '1em', width: '80%' }}>

          {slide.status === BaseDataTypes.activeStatus ?
            <Typography
              style={{ marginBottom: '0.5em' }}
              variant='h2'>
              <>{slide.title}</>
            </Typography>
          :
            <>
              <Typography
                style={{ color: 'gray' }}
                variant='h2'>
                <>{slide.title}</>
              </Typography>
              <Typography
                style={{ color: 'gray' }}
                variant='body2'>
                <i>Deleted</i>
              </Typography>
            </>
          }
        </div>
      </div>

      {/* Slide image */}
      {imageUrl != null ?
        <div style={{ marginBottom: '1em', verticalAlign: 'top' }}>
          <Image
            src={imageUrl}
            fit='cover'
            height='50vh' />
        </div>
      :
        <></>
      }

      {/* Charts */}
      {annualFinancials != null ?
        <FinancialChart
          chartData={annualFinancials} />
        :
        <></>
      }

      {quarterlyFinancials != null ?
        <FinancialChart
          chartData={quarterlyFinancials} />
        :
        <></>
      }

      {dailyChart != null ?
        <FinancialChart
          chartData={dailyChart} />
        :
        <></>
      }

      {/* Slide text */}
      {slide.isTextSlide ?
        <div style={{ textAlign: 'left' }}>
          <Typography
            style={{ marginBottom: '1em' }}
            sx={{ whiteSpace: 'pre-wrap' }}
            variant={textVariant}>
            {slide.text}
          </Typography>
        </div>
      :
        <></>
      }
    </div>
  )
}
