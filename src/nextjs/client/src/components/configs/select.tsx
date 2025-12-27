import { useEffect, useState } from 'react'
import { FormControl, InputLabel, Select } from '@mui/material'
import LoadGenerationsConfigByFilter from './load-by-filter'

interface Props {
  userProfileId: string
  json: any
  setJson: any
}

export default function GenerationsConfigSelect({
                          userProfileId,
                          json,
                          setJson
                        }: Props) {

  // State
  const [generationsConfigs, setGenerationsConfigs] = useState<any[] | undefined>(undefined)
  const [generationsConfigId, setGenerationsConfigId] = useState<string>(json.setGenerationsConfigId)
  const [loaded, setLoaded] = useState<boolean>(false)

  // Effects
  useEffect(() => {

    if (loaded === false ||
        generationsConfigs == null ||
        generationsConfigs?.length === 0) {

      return
    }

    // Set default?
    if (json.generationsConfigId == null ||
        json.generationsConfigId.length === 0) {

      json.generationsConfigId = generationsConfigs[0].id
    }

  }, [loaded])

  // Render
  return (
    <div style={{ minWidth: 275 }}>

      {generationsConfigs != null ?
        <div style={{ marginBottom: '2em', width: '15em' }}>
          <FormControl fullWidth>
            <InputLabel
              htmlFor='select-generations-config'
              required
              shrink>
              Config
            </InputLabel>
            <Select
              inputProps={{
                id: 'select-generations-config',
              }}
              label='Config'
              native
              onChange={(e) => {
                setGenerationsConfigId(e.target.value)

                if (json != null) {
                  json.generationsConfigId = e.target.value
                  setJson(json)
                }
              }}
              variant='outlined'
              value={generationsConfigId}>
              {generationsConfigs.map((thisGenerationsConfig: any) => (
                <option key={thisGenerationsConfig.name} value={thisGenerationsConfig.id}>
                  {thisGenerationsConfig.name}
                </option>
              ))}
            </Select>
          </FormControl>
        </div>
      :
        <></>
      }

      <LoadGenerationsConfigByFilter
        userProfileId={userProfileId}
        setGenerationsConfigs={setGenerationsConfigs}
        setLoaded={setLoaded} />
    </div>
  )
}
