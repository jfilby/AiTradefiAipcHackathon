import { useEffect, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import ReplayIcon from '@mui/icons-material/Replay'
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash'
import { Alert, Button, Typography } from '@mui/material'
import { Image } from 'mui-image'
import { Line } from 'react-chartjs-2'
import '@/components/chartjs/chartjs'
import LabeledIconButton from '@/serene-core-client/components/buttons/labeled-icon-button'
import { BaseDataTypes } from '@/shared/types/base-data-types'
// import DeleteDialog from '../dialogs/delete-dialog'
// import UndeleteDialog from '../dialogs/undelete-dialog'
// import SaveSlideshow from './save'

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

  // Use a reduced text size if an image is present
  const textVariant = slide.generatedImageId == null ? 'h4' : 'h6'

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

      {/* <p>slide: {JSON.stringify(slide)}</p> */}

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

      {slide.generatedImageId != null ?
        <div style={{ marginBottom: '1em' }}>
          <Image
            src={imageUrl}
            fit='scale-down'
            height='35em' />
        </div>
      :
        <></>
      }

      {/* <p>annualFinancials: {JSON.stringify(slide.annualFinancials)}</p> */}

      {annualFinancials != null ?
        <div style={{ marginBottom: '1em' }}>
          <Line
            datasetIdKey='id'
            data={annualFinancials.data}
            options={{
              interaction: { mode: 'index', intersect: false },
              scales: {
                y: {
                  ticks: {
                    callback: (value) =>
                      typeof value === 'number'
                        ? `$${(value / 1e9).toFixed(1)}B`
                        : value,
                  }
                }
              }
            }} />
          </div>
        :
        <></>
      }

      <div style={{ textAlign: 'left' }}>
        <Typography
          style={{ marginBottom: '1em' }}
          variant={textVariant}>
          {slide.text}
        </Typography>
      </div>

      <div style={{ borderTop: '2px solid #eee', paddingTop: '0.5em', width: '100%' }}>
        <div style={{ display: 'inline-block', height: '2em', width: '50%' }}>
          {slide.generatedAudioId != null?
            <LabeledIconButton
              icon={ReplayIcon}
              label='Replay audio'
              onClick={(e: any) => playAudio()}
              style={{ marginRight: '1em' }} />
          :
            <></>
          }

          {slide.status === BaseDataTypes.activeStatus ?

            <LabeledIconButton
              icon={DeleteIcon}
              label='Delete'
              onClick={(e: any) => setDeleteDialogOpen(true)}
              style={{ marginRight: '1em' }} />
          :
            <LabeledIconButton
              icon={RestoreFromTrashIcon}
              label='Undelete'
              onClick={(e: any) => setUndeleteDialogOpen(true)}
              style={{ marginRight: '1em' }} />
          }
        </div>

        <div style={{ display: 'inline-block', height: '2em', textAlign: 'right', verticalAlign: 'top', width: '50%' }}>

          {/* Note: slideNo starts from 1
          <p>slide.slideNo: {slide.slideNo}</p> */}

          {slide.slideNo > 1 ?
            <Button
              onClick={(e) => setSlide(slideshow.slides[slide.slideNo - 2])}
              variant='outlined'>
              Previous
            </Button>
          :
            <></>
          }

          {slide.slideNo < slideshow.slides.length ?
            <Button
              onClick={(e) => setSlide(slideshow.slides[slide.slideNo])}
              style={{ marginLeft: '0.5em' }}
              variant='contained'>
              Next
            </Button>
          :
            <></>
          }
        </div>
      </div>

      {/* <SaveSlide
        userProfileId={userProfileId}
        slideshow={thisSlide}
        isAdd={false}
        setAlertSeverity={setAlertSeverity}
        setMessage={setMessage}
        saveAction={saveAction}
        setSaveAction={setSaveAction}
        setEditMode={undefined}
        redirectToIndexOnSave={false} />

      <DeleteDialog
        open={deleteDialogOpen}
        type='slide'
        name={slide.name}
        setOpen={setDeleteDialogOpen}
        setDeleteConfirmed={setDeleteAction} />

      <UndeleteDialog
        open={undeleteDialogOpen}
        name={slide.name}
        setOpen={setUndeleteDialogOpen}
        setUndeleteConfirmed={setUndeleteAction} /> */}
    </div>
  )
}
