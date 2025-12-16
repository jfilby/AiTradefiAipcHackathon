import { useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import ReplayIcon from '@mui/icons-material/Replay'
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash'
import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes'
import { Button } from '@mui/material'
import LabeledIconButton from '@/serene-core-client/components/buttons/labeled-icon-button'
// import DeleteDialog from '../dialogs/delete-dialog'
// import UndeleteDialog from '../dialogs/undelete-dialog'
// import SaveSlideshow from './save'

interface Props {
  userProfileId: string
  instanceId?: string
  slideshow: any
  slide: any
  setSlide: any
  setShowNotes: any
}

export default function SlideControls({
                          userProfileId,
                          instanceId,
                          slideshow,
                          slide,
                          setSlide,
                          setShowNotes
                        }: Props) {

  // State
  const [play, setPlay] = useState<boolean>(false)

  function playAudio() {
    throw new Error('Function not implemented.')
  }

  // Render
  return (
    <>
      <div style={{ borderTop: '2px solid #eee', paddingTop: '0.5em', width: '100%' }}>
        <div style={{ display: 'inline-block', height: '2em', width: '50%' }}>

          {/* <p>isTextSlide: {JSON.stringify(isTextSlide)}</p> */}

          {slide.generatedAudioId != null?
            <LabeledIconButton
              icon={ReplayIcon}
              label='Replay audio'
              onClick={(e: any) => playAudio()}
              style={{ marginRight: '1em' }} />
          :
            <></>
          }

          {slide.isTextSlide === false &&
           slide.text != null ?
            <LabeledIconButton
              icon={SpeakerNotesIcon}
              label='Notes'
              onClick={(e: any) => setShowNotes(true)}
              style={{ marginRight: '1em' }} />
          :
            <></>
          }

          {/* slide.status === BaseDataTypes.activeStatus ?

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
          */}
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
    </>
  )
}

