import { Typography } from '@mui/material'
import AnalysisCard from './card'

interface Props {
  userProfileId: string
  instanceId?: string
  analyses: any[]
}

export default function ListAnalyses({
                          userProfileId,
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
                <AnalysisCard
                  userProfileId={userProfileId}
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
