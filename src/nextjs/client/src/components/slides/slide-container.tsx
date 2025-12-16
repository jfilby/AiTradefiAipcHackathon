import { useState } from 'react'
import ViewSlide from './view'
import { Button, Typography } from '@mui/material'
import NotesDialog from './notes-dialog'
import SlideControls from './slide-controls'

interface Props {
  userProfileId: string
  instanceId?: string
  slideshow: any
  slide: any
  setSlide: any
}

export default function SlideContainer({
                          userProfileId,
                          instanceId,
                          slideshow,
                          slide,
                          setSlide
                        }: Props) {

  // State
  const [play, setPlay] = useState<boolean>(false)
  const [showNotes, setShowNotes] = useState<boolean>(false)

  // Render
  return (
    <div style={{ marginBottom: '2em', minWidth: 275 }}>

      {/* <p>isTextSlide: {JSON.stringify(isTextSlide)}</p> */}

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

          <div style={{ textAlign: 'center' }}>
            <Button
              onClick={(e) => setPlay(true)}
              sx={{
                padding: '20px 40px',
                fontSize: '1.2rem'
              }}
              variant='contained'>
              Play
            </Button>
          </div>
        </div>
      }

      {play === true ?
        <SlideControls
          userProfileId={userProfileId}
          slideshow={slideshow}
          slide={slide}
          setSlide={setSlide}
          setShowNotes={setShowNotes} />
      :
        <></>
      }

      <NotesDialog
        open={showNotes}
        text={slide.text}
        setOpen={setShowNotes} />
    </div>
  )
}

