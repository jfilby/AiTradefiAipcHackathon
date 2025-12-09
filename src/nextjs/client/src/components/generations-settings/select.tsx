import { FormControl, InputLabel, Select } from '@mui/material'

interface Props {
  generationsSettingsList: any[]
  generationsSettings: string
  setGenerationsSettings: any
  json: any
  setJson: any
}

export default function GenerationsSettingsSelect({
                          generationsSettingsList,
                          generationsSettings,
                          setGenerationsSettings,
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
              setGenerationsSettings(e.target.value)

              if (json != null) {
                json.generationsSettings = e.target.value
                setJson(json)
              }
            }}
            variant='outlined'
            value={generationsSettings}>
            {generationsSettingsList.map((generationsSettings) => (
              <option key={generationsSettings.name} value={generationsSettings.value}>
                {generationsSettings.name}
              </option>
            ))}
          </Select>
        </FormControl>
      </div>

    </div>
  )
}
