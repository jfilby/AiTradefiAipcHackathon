import { Typography } from '@mui/material'
import SlideshowCard from './card'

interface Props {
  userProfileId: string
  instanceId?: string
  slideshows: any[]
  readonly: boolean
}

export default function ListAnalyses({
                          userProfileId,
                          instanceId,
                          slideshows,
                          readonly
                        }: Props) {

  // Render
  return (
    <div style={{ marginBottom: '2em' }}>
      {slideshows != null ?
        <>
          {slideshows.length > 0 ?
            <>
              {slideshows.map(slideshow => (
                <SlideshowCard
                  userProfileId={userProfileId}
                  slideshow={slideshow}
                  readonly={readonly} />
              ))}
            </>
          :
            <Typography
              style={{ marginTop: '2em' }}
              variant='body1'>
              No slideshows to list.
            </Typography>
          }
        </>
      :
        <></>
      }
    </div>
  )
}
