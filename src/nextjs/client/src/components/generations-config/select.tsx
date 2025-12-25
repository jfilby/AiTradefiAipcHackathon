import { FormControl, InputLabel, Select } from '@mui/material'

interface Props {
  generationsConfigList: any[]
  generationsConfig: string
  setGenerationsConfig: any
  json: any
  setJson: any
}

export default function GenerationsConfigSelect({
                          generationsConfigList,
                          generationsConfig,
                          setGenerationsConfig,
                          json,
                          setJson
                        }: Props) {

  // Render
  return (
    <div style={{ minWidth: 275 }}>

      <div style={{ marginBottom: '1em', width: '15em' }}>
        <FormControl fullWidth>
          <InputLabel
            htmlFor='select-generations-settings'
            required
            shrink>
            Generations settings
          </InputLabel>
          <Select
            inputProps={{
              id: 'select-generations-settings',
            }}
            label='Generations settings'
            native
            onChange={(e) => {
              setGenerationsConfig(e.target.value)

              if (json != null) {
                json.generationsConfig = e.target.value
                setJson(json)
              }
            }}
            variant='outlined'
            value={generationsConfig}>
            {generationsConfigList.map((generationsConfig) => (
              <option key={generationsConfig.name} value={generationsConfig.value}>
                {generationsConfig.name}
              </option>
            ))}
          </Select>
        </FormControl>
      </div>

    </div>
  )
}
