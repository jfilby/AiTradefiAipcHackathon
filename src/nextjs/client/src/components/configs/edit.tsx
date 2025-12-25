import { useState } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SaveIcon from '@mui/icons-material/Save'
import { Alert, FormControl, InputLabel, Select, TextField } from '@mui/material'
import LabeledIconButton from '@/serene-core-client/components/buttons/labeled-icon-button'
import { BaseDataTypes } from '@/shared/types/base-data-types'

interface Props {
  userProfileId: string
  instanceId?: string
  alertSeverity: any
  setAlertSeverity: any
  message: string | undefined
  setMessage: any
  generationsConfig: any
  setGenerationsConfig: any
  setSaveAction: any
}

export default function EditGenerationsConfig({
                          userProfileId,
                          instanceId,
                          alertSeverity,
                          setAlertSeverity,
                          message,
                          setMessage,
                          generationsConfig,
                          setGenerationsConfig,
                          setSaveAction
                        }: Props) {

  // Consts
  const indexPage = `/configs`

  // State
  const [name, setName] = useState<string>(generationsConfig.name)
  const [elevenlabsVoiceId, setElevenlabsVoiceId] = useState<string>(generationsConfig.elevenlabsVoiceId)
  const [status, setStatus] = useState<string>(generationsConfig.status)

  // Functions
  function verifyFields() {

    if (name == null ||
        name.trim() === '') {

      setAlertSeverity('error')
      setMessage('The name must be specified')
      return false
    }

    if (status == null ||
        status.trim() === '') {

      setAlertSeverity('error')
      setMessage('The status must be specified')
      return false
    }

    // Verified OK
    return true
  }

  // Render
  return (
    <div style={{ minWidth: 275 }}>

      {/* <p>alertSeverity: {alertSeverity}</p>
      <p>message: {message}</p> */}

      {message != null ?
        <Alert
          severity={alertSeverity}
          style={{ marginBottom: '2em' }}>
          {message}
        </Alert>
      :
        <></>
      }

      <div style={{ marginBottom: '2em' }}>

        <div style={{ marginBottom: '1em' }}>
          <TextField
            autoComplete='off'
            disabled={generationsConfig.status !== BaseDataTypes.newStatus}
            label='Name'
            onChange={(e) => {
              setName(e.target.value)

              generationsConfig.name = e.target.value
              setGenerationsConfig(generationsConfig)
            }}
            required
            slotProps={{
              inputLabel: {
                shrink: Boolean(name),
              }
            }}
            style={{ marginBottom: '1em' }}
            value={name} />
        </div>

        <div style={{ marginBottom: '1em', width: '15em' }}>
          <FormControl fullWidth>
            <InputLabel
              htmlFor='select-status'
              required
              shrink>
              Status
            </InputLabel>
            <Select
              inputProps={{
                id: 'select-status',
              }}
              label='Status'
              native
              onChange={(e) => {
                setStatus(e.target.value)

                generationsConfig.status = e.target.value
                setGenerationsConfig(generationsConfig)
              }}
              variant='outlined'
              value={status}>
              {BaseDataTypes.statusArray.map((status) => (
                <option key={status.name} value={status.value}>
                  {status.name}
                </option>
              ))}
            </Select>
          </FormControl>
        </div>

        <div style={{ marginBottom: '1em', width: '15em' }}>
          <FormControl fullWidth>
            <InputLabel
              htmlFor='select-elevenlabs-voice'
              required
              shrink>
              Elevenlabs Voice
            </InputLabel>
            <Select
              disabled={generationsConfig.status !== BaseDataTypes.newStatus}
              inputProps={{
                id: 'select-elevenlabs-voice',
              }}
              label='ElevenLabs voice'
              native
              onChange={(e) => {
                setStatus(e.target.value)

                generationsConfig.elevenlabsVoiceId = e.target.value
                setGenerationsConfig(generationsConfig)
              }}
              variant='outlined'
              value={elevenlabsVoiceId}>
              {BaseDataTypes.instrumentTypesArray.map((instrumentType) => (
                <option key={instrumentType.name} value={instrumentType.value}>
                  {instrumentType.name}
                </option>
              ))}
            </Select>
          </FormControl>
        </div>

        <div style={{ textAlign: 'right', width: '100%' }}>

          {generationsConfig.status === BaseDataTypes.newStatus ?
            <div style={{ display: 'inline-block' }}>
              <LabeledIconButton
                icon={SaveIcon}
                label='Save'
                onClick={(e: any) => {
                  generationsConfig.status = status

                  if (verifyFields() === true) {

                    setGenerationsConfig(generationsConfig)
                    setSaveAction(true)
                  }
                }} />
            </div>
          :
            <></>
          }

          <div style={{ display: 'inline-block' }}>
            <LabeledIconButton
              icon={ArrowBackIcon}
              label='Back'
              onClick={(e: any) => {
                window.location.href = indexPage
              }}
              style={{ marginLeft: '1em' }} />
          </div>
        </div>

      </div>
    </div>
  )
}
