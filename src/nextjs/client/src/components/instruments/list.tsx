import { Typography } from '@mui/material'
import InstrumentCard from './card'

interface Props {
  instanceId?: string
  instruments: any[]
}

export default function ListInstruments({
                          instanceId,
                          instruments
                        }: Props) {

  // Render
  return (
    <div style={{ marginBottom: '2em' }}>
      {instruments != null ?
        <>
          {instruments.length > 0 ?
            <>
              {instruments.map(instrument => (
                <InstrumentCard
                  key={instrument.id}
                  instanceId={instanceId}
                  instrument={instrument} />
              ))}
            </>
          :
            <Typography
              style={{ marginTop: '2em' }}
              variant='body1'>
              No instruments to list.
            </Typography>
          }
        </>
      :
        <></>
      }
    </div>
  )
}
