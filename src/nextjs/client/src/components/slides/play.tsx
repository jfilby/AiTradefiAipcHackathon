import { useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import ReplayIcon from '@mui/icons-material/Replay'
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash'
import ViewSlide from './view'
import { Button, Typography } from '@mui/material'
import LabeledIconButton from '@/serene-core-client/components/buttons/labeled-icon-button'

interface Props {
  userProfileId: string
  instanceId?: string
  slideshow: any
  slide: any
  setSlide: any
}

export default function PlaySlide({
                          userProfileId,
                          instanceId,
                          slideshow,
                          slide,
                          setSlide
                        }: Props) {

  // State
  const [play, setPlay] = useState<boolean>(false)

  function playAudio() {
    throw new Error('Function not implemented.')
  }

  // Render
  return (
    <div style={{ marginBottom: '2em', minWidth: 275 }}>

      {play === true ?
        <ViewSlide
          userProfileId={userProfileId}
          instanceId={undefined}
          slideshow={slideshow}
          slide={slide}
          setSlide={setSlide} />
      :
        <div>
          <Typography
            style={{ marginBottom: '2em' }}
            variant='h1'>
            {slide.title}
          </Typography>

          <center>
            <Button
              onClick={(e) => setPlay(true)}
              sx={{
                padding: '20px 40px',
                fontSize: '1.2rem',
              }}
              variant='contained'>
              Play
            </Button>
          </center>
        </div>
      }

      {/* Slide controls */}
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

    </div>
  )
}

