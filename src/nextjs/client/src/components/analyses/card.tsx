import { useEffect, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash'
import { Alert, Link, Typography } from '@mui/material'
import LabeledIconButton from '@/serene-core-client/components/buttons/labeled-icon-button'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import DeleteDialog from '../dialogs/delete-dialog'
import UndeleteDialog from '../dialogs/undelete-dialog'
import SaveAnalysis from './save'

interface Props {
  userProfileId: string
  instanceId?: string
  analysis: any
}

export default function AnalysisCard({
                          userProfileId,
                          instanceId,
                          analysis
                        }: Props) {

  // Consts
  const viewUrl = `/analysis/${analysis.id}`

  // State
  const [alertSeverity, setAlertSeverity] = useState<any>('')
  const [message, setMessage] = useState<string | undefined>(undefined)
  const [thisAnalysis, setThisAnalysis] = useState<any>(analysis)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [undeleteDialogOpen, setUndeleteDialogOpen] = useState(false)
  const [deleteAction, setDeleteAction] = useState(false)
  const [undeleteAction, setUndeleteAction] = useState(false)
  const [saveAction, setSaveAction] = useState(false)

  // Effects
  useEffect(() => {

    if (deleteAction === true) {

      thisAnalysis.status = BaseDataTypes.deletePendingStatus
      setThisAnalysis(thisAnalysis)
      setSaveAction(true)
      setDeleteAction(false)
    }

  }, [deleteAction])

  useEffect(() => {

    if (undeleteAction === true) {

      thisAnalysis.status = BaseDataTypes.newStatus
      setThisAnalysis(thisAnalysis)
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

      {/*<p>analysis: {JSON.stringify(analysis)}</p>*/}

      <div style={{ marginBottom: '2em' }}>

        <Link href={viewUrl}>
          <div style={{ display: 'inline-block', marginBottom: '1em', width: '80%' }}>

            {thisAnalysis.status !== BaseDataTypes.deletePendingStatus ?
              <Typography
                sx={{
                  display: 'inline-block',
                  marginBottom: '0.5em',
                  '&:hover': { textDecoration: 'underline' },
                }}
                variant='h5'>
                {thisAnalysis.name}
              </Typography>
            :
              <>
                <Typography
                  style={{ color: 'gray' }}
                  variant='h5'>
                  {thisAnalysis.name}
                </Typography>
              </>
            }

            <Typography
              style={{ marginBottom: '1em' }}
              variant='body1'>
              {analysis.description}
            </Typography>

            <Typography
              style={{ color: 'gray' }}
              variant='body2'>
              {BaseDataTypes.analysisStatusMap[analysis.status]}
            </Typography>
          </div>
        </Link>

        <div style={{ display: 'inline-block', height: '2em', textAlign: 'right', width: '20%' }}>
          <>
            {thisAnalysis.status === BaseDataTypes.deletePendingStatus ?

              <LabeledIconButton
                icon={RestoreFromTrashIcon}
                label='Undelete'
                onClick={(e: any) => setUndeleteDialogOpen(true)}
                style={{ marginRight: '1em' }} />
            :
              <LabeledIconButton
                icon={DeleteIcon}
                label='Delete'
                onClick={(e: any) => setDeleteDialogOpen(true)}
                style={{ marginRight: '1em' }} />
            }
          </>
        </div>
      </div>

      <SaveAnalysis
        userProfileId={userProfileId}
        analysis={thisAnalysis}
        isAdd={false}
        setAlertSeverity={setAlertSeverity}
        setMessage={setMessage}
        saveAction={saveAction}
        setSaveAction={setSaveAction}
        setEditMode={undefined}
        redirectToIndexOnSave={false} />

      <DeleteDialog
        open={deleteDialogOpen}
        type='analysis'
        name={analysis.name}
        setOpen={setDeleteDialogOpen}
        setDeleteConfirmed={setDeleteAction} />

      <UndeleteDialog
        open={undeleteDialogOpen}
        name={analysis.name}
        setOpen={setUndeleteDialogOpen}
        setUndeleteConfirmed={setUndeleteAction} />
    </div>
  )
}
