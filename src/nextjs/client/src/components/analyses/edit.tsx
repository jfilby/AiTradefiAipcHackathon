import { useEffect, useState } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CancelIcon from '@mui/icons-material/Cancel'
import SaveIcon from '@mui/icons-material/Save'
import { Alert, FormControl, InputLabel, Select, TextField, Typography } from '@mui/material'
import LabeledIconButton from '@/serene-core-client/components/buttons/labeled-icon-button'
import TextAreaField from '@/serene-core-client/components/basics/text-area-field'
import { BaseDataTypes } from '@/shared/types/base-data-types'

interface Props {
  userProfileId: string
  instanceId?: string
  alertSeverity: any
  setAlertSeverity: any
  message: string | undefined
  setMessage: any
  analysis: any
  setAnalysis: any
  setLoadAction: any
  setSaveAction: any
  analysisRefreshed: boolean
  setAnalysisRefreshed: any
}

export default function EditAnalysis({
                          userProfileId,
                          instanceId,
                          alertSeverity,
                          setAlertSeverity,
                          message,
                          setMessage,
                          analysis,
                          setAnalysis,
                          setLoadAction,
                          setSaveAction,
                          analysisRefreshed,
                          setAnalysisRefreshed
                        }: Props) {

  // Consts
  const indexPage = `/analyses`

  // State
  const [name, setName] = useState<string>(analysis.name)
  const [type, setType] = useState<string>(BaseDataTypes.screenerType)
  const [status, setStatus] = useState<string>(analysis.status)
  const [instrumentType, setInstrumentType] = useState<string>(analysis.instrumentType)
  const [description, setDescription] = useState<string>(analysis.description)
  const [prompt, setPrompt] = useState<string>(analysis.prompt)
  const [defaultMinScore, setDefaultMinScore] = useState<string>(analysis.defaultMinScore)

  // Effects
  useEffect(() => {

    // Skip if not refreshed
    if (analysisRefreshed === false) {
      return
    }

    // Update fields
    setName(analysis.name)
    setDescription(analysis.description)
    setPrompt(analysis.prompt)

    // Set to not refreshed
    setAnalysisRefreshed(false)

  }, [analysisRefreshed])

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

    if (description == null ||
        description.trim() === '') {

      setAlertSeverity('error')
      setMessage('The description must be specified')
      return false
    }

    if (prompt == null ||
        prompt.trim() === '') {

      setAlertSeverity('error')
      setMessage('The prompt must be specified')
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
            disabled={analysis.status !== BaseDataTypes.newStatus}
            label='Name'
            onChange={(e) => {
              setName(e.target.value)

              analysis.name = e.target.value
              setAnalysis(analysis)
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

        {/* <div style={{ marginBottom: '1em', width: '15em' }}>
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

                analysis.status = e.target.value
                setAnalysis(analysis)
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
        </div> */}

        <div style={{ marginBottom: '1em', width: '15em' }}>
          <FormControl fullWidth>
            <InputLabel
              htmlFor='select-instrument-type'
              required
              shrink>
              Instrument type
            </InputLabel>
            <Select
              disabled={analysis.status !== BaseDataTypes.newStatus}
              inputProps={{
                id: 'select-instrument-type',
              }}
              label='Instrument type'
              native
              onChange={(e) => {
                setStatus(e.target.value)

                analysis.instrumentType = e.target.value
                setAnalysis(analysis)
              }}
              variant='outlined'
              value={instrumentType}>
              {BaseDataTypes.instrumentTypesArray.map((instrumentType) => (
                <option key={instrumentType.name} value={instrumentType.value}>
                  {instrumentType.name}
                </option>
              ))}
            </Select>
          </FormControl>
        </div>

        <TextAreaField
          disabled={analysis.status !== BaseDataTypes.newStatus}
          id='description'
          label='Description'
          minRows={5}
          onChange={(e: any) => {
            setDescription(e.target.value)

            analysis.description = e.target.value
            setAnalysis(analysis)
          }}
          required
          style={{ marginBottom: '2em' }}
          value={description} />

        <TextAreaField
          disabled={analysis.status !== BaseDataTypes.newStatus}
          id='prompt'
          label='Prompt'
          minRows={5}
          onChange={(e: any) => {
            setPrompt(e.target.value)

            analysis.prompt = e.target.value
            setAnalysis(analysis)
          }}
          required
          style={{ marginBottom: '2em' }}
          value={prompt} />

        {/* <div style={{ marginBottom: '1em' }}>
          <TextField
            autoComplete='off'
            label='Default min score (0..1)'
            onChange={(e) => {
              setDefaultMinScore(e.target.value)

              try {
                analysis.defaultMinScore = parseFloat(e.target.value)
              } catch(e) {
                ;
              }

              setAnalysis(analysis)
            }}
            required
            style={{ marginBottom: '1em' }}
            value={defaultMinScore} />
        </div> */}

        <div style={{ textAlign: 'right', width: '100%' }}>

          {analysis.status === BaseDataTypes.newStatus ?
            <div style={{ display: 'inline-block' }}>
              <LabeledIconButton
                icon={SaveIcon}
                label='Save'
                onClick={(e: any) => {
                  analysis.status = status

                  if (verifyFields() === true) {

                    setAnalysis(analysis)
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
