import { Typography } from '@mui/material'
import ViewAnalysis from './view'

interface Props {
  instanceId?: string
  analyses: any[]
}

export default function ListAnalyses({
                          instanceId,
                          analyses
                        }: Props) {

  // Render
  return (
    <div style={{ marginBottom: '2em' }}>
      {analyses != null ?
        <>
          {analyses.length > 0 ?
            <>
              {analyses.map(analysis => (
                <ViewAnalysis
                  analysis={analysis} />
              ))}
            </>
          :
            <Typography
              style={{ marginTop: '2em' }}
              variant='body1'>
              No analyses to list.
            </Typography>
          }
        </>
      :
        <></>
      }
    </div>
  )
}
