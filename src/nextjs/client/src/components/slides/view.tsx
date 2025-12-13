import { useEffect, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import ReplayIcon from '@mui/icons-material/Replay'
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash'
import { Alert, Typography } from '@mui/material'
import LabeledIconButton from '@/serene-core-client/components/buttons/labeled-icon-button'
import { BaseDataTypes } from '@/shared/types/base-data-types'
// import DeleteDialog from '../dialogs/delete-dialog'
// import UndeleteDialog from '../dialogs/undelete-dialog'
// import SaveSlideshow from './save'

interface Props {
  userProfileId: string
  instanceId?: string
  slide: any
}

export default function ViewSlide({
                          userProfileId,
                          instanceId,
                          slide
                        }: Props) {

  // Const
  const audioUrl =
    `${process.env.NEXT_PUBLIC_API_URL}/api/audio/${slide.generatedAudioId}/get`

  // State
  const [alertSeverity, setAlertSeverity] = useState<any>('')
  const [message, setMessage] = useState<string | undefined>(undefined)
  const [thisSlide, setThisSlide] = useState<any>(slide)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [undeleteDialogOpen, setUndeleteDialogOpen] = useState(false)
  const [deleteAction, setDeleteAction] = useState(false)
  const [undeleteAction, setUndeleteAction] = useState(false)
  const [saveAction, setSaveAction] = useState(false)

  // Functions
  async function playAudio() {

    console.log(`playing..`)

    const audio = new Audio(audioUrl)
    audio.play()
  }

  // Effects
  useEffect(() => {

    playAudio()
  }, [])

  useEffect(() => {

    if (deleteAction === true) {

      thisSlide.status = BaseDataTypes.deletePendingStatus
      setThisSlide(thisSlide)
      setSaveAction(true)
      setDeleteAction(false)
    }

  }, [deleteAction])

  useEffect(() => {

    if (undeleteAction === true) {

      thisSlide.status = BaseDataTypes.activeStatus
      setThisSlide(thisSlide)
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

      {/* <p>thisSlide: {JSON.stringify(thisSlide)}</p> */}

      <div style={{ marginBottom: '2em' }}>
        <div style={{ marginBottom: '1em', width: '80%' }}>

          {thisSlide.status === BaseDataTypes.activeStatus ?
            <Typography
              style={{ marginBottom: '0.5em' }}
              variant='h1'>
              <>{thisSlide.title}</>
            </Typography>
          :
            <>
              <Typography
                style={{ color: 'gray' }}
                variant='h1'>
                <>{thisSlide.title}</>
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

      <div style={{ /* border: '1px solid #eee', */ minHeight: '30em', textAlign: 'left' }}>
        <Typography variant='h3'>
          {thisSlide.text}
        </Typography>
      </div>

      <div style={{ width: '100%' }}>
        <div style={{ display: 'inline-block', height: '2em', width: '80%' }}>
          {slide.generatedAudioId != null?
            <LabeledIconButton
              icon={ReplayIcon}
              label='Replay audio'
              onClick={(e: any) => playAudio()}
              style={{ marginRight: '1em' }} />
          :
            <></>
          }
        </div>

        <div style={{ display: 'inline-block', height: '2em', textAlign: 'right', width: '20%' }}>
          <>
            {thisSlide.status === BaseDataTypes.activeStatus ?

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
          </>
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
