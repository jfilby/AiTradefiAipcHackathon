import { useEffect, useState } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SaveIcon from '@mui/icons-material/Save'
import { PlayArrow } from '@mui/icons-material'
import { Alert, Checkbox, FormControl, FormControlLabel, InputLabel, ListItemText, MenuItem, Select, TextField, Typography } from '@mui/material'
import LabeledIconButton from '@/serene-core-client/components/buttons/labeled-icon-button'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import GetVoicePreviewAudio from '../elevenlabs-voices/get-voice-preview-audio'
import LoadElevenLabsVoicesByFilter from '../elevenlabs-voices/load-by-filter'

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
  const [elevenLabsVoiceId, setElevenLabsVoiceId] = useState<string>(generationsConfig.elevenLabsVoiceId)
  const [status, setStatus] = useState<string>(generationsConfig.status)
  const [isDefault, setIsDefault] = useState<boolean>(generationsConfig.isDefault)

  const [elevenLabsVoices, setElevenLabsVoices] = useState<any[] | undefined>(undefined)
  const [elevenLabsVoicesLoaded, setElevenLabsVoicesLoaded] = useState<boolean>(false)
  const [loadVoicePreviewAudio, setLoadVoicePreviewAudio] = useState<boolean>(false)
  const [generatedAudioId, setGeneratedAudioId] = useState<string | undefined>(undefined)

  // Effects
  useEffect(() => {

    playAudio()

  }, [generatedAudioId])

  // Functions
  async function playAudio() {

    // console.log(`playing audio..`)

    // Validate
    if (generatedAudioId == null) {
      return
    }

    // Get the URL
    const audioUrl = generatedAudioId ?
      `${process.env.NEXT_PUBLIC_API_URL}/api/audio/${generatedAudioId}/get` :
      undefined

      // Skip if audio URL not found
    if (!audioUrl) return

    // Play audio
    const audio = new Audio(audioUrl)
    audio.play()
  }

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
    setAlertSeverity(undefined)
    setMessage(undefined)

    return true
  }

  // Render
  return (
    <div style={{ minWidth: 275 }}>

      {/* <p>alertSeverity: {alertSeverity}</p>
      <p>message: {message}</p>
      <p>name: {name}</p> */}

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

        <div style={{ marginBottom: '2em', width: '15em' }}>
          <FormControl fullWidth>
            <InputLabel
              htmlFor='select-status'
              required>
              Status
            </InputLabel>
            <Select
              labelId='select-status'
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

        {elevenLabsVoices != null ?
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1em' }}>
            <div style={{ width: '25em' }}>
              <FormControl fullWidth>
                <InputLabel
                  htmlFor='select-elevenlabs-voice'>
                  ElevenLabs voice
                </InputLabel>
                <Select
                  label='ElevenLabs voice'
                  value={elevenLabsVoiceId}
                  onChange={(e) => {
                    setElevenLabsVoiceId(e.target.value)

                    generationsConfig.elevenLabsVoiceId = e.target.value
                    setGenerationsConfig(generationsConfig)
                  }}
                  variant='outlined'
                  renderValue={(selected) => {
                    const voice = elevenLabsVoices.find(v => v.id === selected)
                    return voice?.name ?? ''
                  }}>
                  {elevenLabsVoices.map((voice) => (
                    <MenuItem key={voice.id} value={voice.id}>
                      <ListItemText
                        primary={voice.name}
                        secondary={
                          <Typography
                            variant='body2'
                            color='text.secondary'>
                            {voice.description}
                          </Typography>
                        } />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <LabeledIconButton
              icon={PlayArrow}
              label='Preview'
              onClick={(e: any) => setLoadVoicePreviewAudio(true)}
              style={{ marginLeft: '1em' }} />
          </div>
        :
          <></>
        }

        <div style={{ display: 'inline-block', marginBottom: '1em' }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isDefault}
                onChange={(e) => {
                  setIsDefault(e.target.checked)

                  generationsConfig.isDefault = e.target.checked
                  setGenerationsConfig(generationsConfig)
                }} />
            }
            label='Default' />
        </div>

        <div style={{ textAlign: 'right', width: '100%' }}>

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

      <GetVoicePreviewAudio
        elevenLabsVoiceId={elevenLabsVoiceId}
        setAlertSeverity={setAlertSeverity}
        setMessage={setMessage}
        setGeneratedAudioId={setGeneratedAudioId}
        loadVoicePreviewAudio={loadVoicePreviewAudio}
        setLoadVoicePreviewAudio={setLoadVoicePreviewAudio} />

      <LoadElevenLabsVoicesByFilter
        userProfileId={userProfileId}
        status={BaseDataTypes.activeStatus}
        addBlank={true}
        setElevenLabsVoices={setElevenLabsVoices}
        setLoaded={setElevenLabsVoicesLoaded} />
    </div>
  )
}
