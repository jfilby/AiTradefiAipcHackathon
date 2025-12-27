import { useEffect, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash'
import { Alert, Link, Typography } from '@mui/material'
import LabeledIconButton from '@/serene-core-client/components/buttons/labeled-icon-button'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import DeleteDialog from '../dialogs/delete-dialog'
import UndeleteDialog from '../dialogs/undelete-dialog'
import SaveGenerationsConfig from './save'

interface Props {
  userProfileId: string
  instanceId?: string
  generationsConfig: any
}

export default function ElevenLabsVoiceCard({
                          userProfileId,
                          instanceId,
                          generationsConfig
                        }: Props) {

  // Consts
  const viewUrl = `/config/${generationsConfig.id}`

  // State
  const [alertSeverity, setAlertSeverity] = useState<any>('')
  const [message, setMessage] = useState<string | undefined>(undefined)
  const [thisGenerationsConfig, setThisGenerationsConfig] = useState<any>(generationsConfig)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [undeleteDialogOpen, setUndeleteDialogOpen] = useState(false)
  const [deleteAction, setDeleteAction] = useState(false)
  const [undeleteAction, setUndeleteAction] = useState(false)
  const [saveAction, setSaveAction] = useState(false)

  // Effects
  useEffect(() => {

    if (deleteAction === true) {

      thisGenerationsConfig.status = BaseDataTypes.deletePendingStatus
      setThisGenerationsConfig(thisGenerationsConfig)
      setSaveAction(true)
      setDeleteAction(false)
    }

  }, [deleteAction])

  useEffect(() => {

    if (undeleteAction === true) {

      thisGenerationsConfig.status = BaseDataTypes.activeStatus
      setThisGenerationsConfig(thisGenerationsConfig)
      setSaveAction(true)
      setUndeleteAction(false)
    }

  }, [undeleteAction])

  // Render
  return (
    <div style={{ marginBottom: '2em', minWidth: 275 }}>

      {message != null ?
        <Alert
          severity={alertSeverity}
          style={{ marginBottom: '2em' }}>
          {message}
        </Alert>
      :
        <></>
      }

      {/*<p>generationsConfig: {JSON.stringify(generationsConfig)}</p>*/}

      <div style={{ marginBottom: '2em' }}>

        <div
          onClick={(e) => window.location.href = viewUrl}
          style={{ display: 'inline-block', marginBottom: '1em', width: '80%' }}>

          {thisGenerationsConfig.status === BaseDataTypes.activeStatus ?
            <Link href={viewUrl}>
              <a style={{ textDecoration: 'none', color: 'inherit' }}>
                <Typography
                  variant='h5'
                  sx={{
                    display: 'inline-block',
                    marginBottom: '0.5em',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  {thisGenerationsConfig.name}
                </Typography>
              </a>
            </Link>
          :
            <>
              <Typography
                style={{ color: 'gray' }}
                variant='h5'>
                <>{generationsConfig.name}</>
              </Typography>
              <Typography
                style={{ color: 'gray' }}
                variant='body2'>
                <i>Deleted</i>
              </Typography>
            </>
          }

          {generationsConfig.elevenLabsVoice?.name ?
            <Typography
              style={{ marginBottom: '1em' }}
              variant='body1'>
              Voiced by {generationsConfig.elevenLabsVoice?.name}
            </Typography>
          :
            <></>
          }

          {generationsConfig.isDefault ?
            <Typography
              style={{ color: 'gray' }}
              variant='body2'>
              Default
            </Typography>
          :
            <></>
          }

        </div>
        <div style={{ display: 'inline-block', height: '2em', textAlign: 'right', width: '20%' }}>
          <>
            {thisGenerationsConfig.status === BaseDataTypes.activeStatus ?

              <LabeledIconButton
                icon={DeleteIcon}
                label='Delete'
                onClick={(e: any) => setDeleteDialogOpen(true)}
                style={{ marginRight: '1em' }} />
            :
              <LabeledIconButton
                icon={RestoreFromTrashIcon}
                label='Undelete'
                onClick={(e: any) => setUndeleteDialogOpen(true)}
                style={{ marginRight: '1em' }} />
            }
          </>
        </div>
      </div>

      <SaveGenerationsConfig
        userProfileId={userProfileId}
        generationsConfig={thisGenerationsConfig}
        isAdd={false}
        setAlertSeverity={setAlertSeverity}
        setMessage={setMessage}
        saveAction={saveAction}
        setSaveAction={setSaveAction}
        setEditMode={undefined}
        redirectToIndexOnSave={false} />

      <DeleteDialog
        open={deleteDialogOpen}
        type='generationsConfig'
        name={generationsConfig.name}
        setOpen={setDeleteDialogOpen}
        setDeleteConfirmed={setDeleteAction} />

      <UndeleteDialog
        open={undeleteDialogOpen}
        name={generationsConfig.name}
        setOpen={setUndeleteDialogOpen}
        setUndeleteConfirmed={setUndeleteAction} />
    </div>
  )
}
