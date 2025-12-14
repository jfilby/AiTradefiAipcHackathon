import { useState } from 'react'
import ViewSlide from './view'
import { Button, Typography } from '@mui/material'

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
    </div>
  )
}

