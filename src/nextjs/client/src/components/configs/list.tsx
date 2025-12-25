import { Typography } from '@mui/material'
import GenerationsConfigCard from './card'

interface Props {
  userProfileId: string
  instanceId?: string
  generationsConfigs: any[]
}

export default function ListGenerationsConfigs({
                          userProfileId,
                          instanceId,
                          generationsConfigs
                        }: Props) {

  // Render
  return (
    <div style={{ marginBottom: '2em' }}>
      {generationsConfigs != null ?
        <>
          {generationsConfigs.length > 0 ?
            <>
              {generationsConfigs.map(generationsConfig => (
                <GenerationsConfigCard
                  userProfileId={userProfileId}
                  generationsConfig={generationsConfig} />
              ))}
            </>
          :
            <Typography
              style={{ marginTop: '2em' }}
              variant='body1'>
              No configs to list.
            </Typography>
          }
        </>
      :
        <></>
      }
    </div>
  )
}
