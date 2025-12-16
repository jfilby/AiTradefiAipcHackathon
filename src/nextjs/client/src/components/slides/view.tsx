import { useEffect, useState } from 'react'
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
}

export default function ViewSlide({
                          userProfileId,
                          instanceId,
                          slideshow,
                          slide,
                          setSlide
                        }: Props) {

  // Const
  const audioUrl = slide.generatedAudioId ?
    `${process.env.NEXT_PUBLIC_API_URL}/api/audio/${slide.generatedAudioId}/get` :
    undefined

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
  const textVariant =
          (slide.annualFinancials ||
           slide.quarterlyFinancials ||
           slide.generatedImageId) == null ? 'h5' : 'h6'

  // State
  const [alertSeverity, setAlertSeverity] = useState<any>('')
  const [message, setMessage] = useState<string | undefined>(undefined)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [undeleteDialogOpen, setUndeleteDialogOpen] = useState(false)
  const [deleteAction, setDeleteAction] = useState(false)
  const [undeleteAction, setUndeleteAction] = useState(false)
  const [saveAction, setSaveAction] = useState(false)

  // Functions
  async function playAudio() {

    // console.log(`playing audio..`)

    const audio = new Audio(audioUrl)
    audio.play()
  }

  // Effects
  useEffect(() => {

    if (audioUrl != null) {
      playAudio()
    }
  }, [])

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
      <div style={{ textAlign: 'left' }}>
        <Typography
          style={{ marginBottom: '1em' }}
          sx={{ whiteSpace: 'pre-wrap' }}
          variant={textVariant}>
          {slide.text}
        </Typography>
      </div>
    </div>
  )
}
