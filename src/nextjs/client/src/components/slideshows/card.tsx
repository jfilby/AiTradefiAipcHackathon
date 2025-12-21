import { useEffect, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash'
import { Alert, Link, Typography } from '@mui/material'
import LabeledIconButton from '@/serene-core-client/components/buttons/labeled-icon-button'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import DeleteDialog from '../dialogs/delete-dialog'
import UndeleteDialog from '../dialogs/undelete-dialog'
// import SaveSlideshow from './save'

interface Props {
  userProfileId: string
  instanceId?: string
  slideshow: any
}

export default function SlideshowCard({
                          userProfileId,
                          instanceId,
                          slideshow
                        }: Props) {

  // Consts
  const viewUrl = `/slideshow/${slideshow.id}`
  const firstSlide = slideshow.slides.length > 0 ? slideshow.slides[0] : {
    title: '?',
    text: '..'
  }

  // State
  const [alertSeverity, setAlertSeverity] = useState<any>('')
  const [message, setMessage] = useState<string | undefined>(undefined)
  const [thisSlideshow, setThisSlideshow] = useState<any>(slideshow)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [undeleteDialogOpen, setUndeleteDialogOpen] = useState(false)
  const [deleteAction, setDeleteAction] = useState(false)
  const [undeleteAction, setUndeleteAction] = useState(false)
  const [saveAction, setSaveAction] = useState(false)

  // Effects
  useEffect(() => {

    if (deleteAction === true) {

      thisSlideshow.status = BaseDataTypes.deletePendingStatus
      setThisSlideshow(thisSlideshow)
      setSaveAction(true)
      setDeleteAction(false)
    }

  }, [deleteAction])

  useEffect(() => {

    if (undeleteAction === true) {

      thisSlideshow.status = BaseDataTypes.activeStatus
      setThisSlideshow(thisSlideshow)
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

      {/*<p>slideshow: {JSON.stringify(slideshow)}</p>*/}

      <div style={{ marginBottom: '2em' }}>

        <div
          onClick={(e) => window.location.href = viewUrl}
          style={{ display: 'inline-block', marginBottom: '1em', width: '80%' }}>

          {thisSlideshow.status === BaseDataTypes.activeStatus ?
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
                  {thisSlideshow.tradeAnalysis.instrument.name}
                </Typography>

                <Typography
                  variant='body2'
                  sx={{
                    display: 'inline-block',
                    marginLeft: '0.5em',
                    width: '50%',
                  }}
                >
                  <span>{thisSlideshow.tradeAnalysis.instrument.exchange.name}</span>
                  <span style={{ color: '#660', marginLeft: '1em' }}>
                    {Math.floor(thisSlideshow.tradeAnalysis.score * 100)}%
                  </span>
                </Typography>
              </a>
            </Link>
          :
            <>
              <Typography
                style={{ color: 'gray' }}
                variant='h5'>
                <>{firstSlide.title}</>
              </Typography>
              <Typography
                style={{ color: 'gray' }}
                variant='body2'>
                <i>Deleted</i>
              </Typography>
            </>
          }

          <Typography variant='body1'>
            {firstSlide.text}
          </Typography>

        </div>
        <div style={{ display: 'inline-block', height: '2em', textAlign: 'right', width: '20%' }}>
          <>
            {thisSlideshow.status === BaseDataTypes.activeStatus ?

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

      {/* <SaveSlideshow
        userProfileId={userProfileId}
        slideshow={thisSlideshow}
        isAdd={false}
        setAlertSeverity={setAlertSeverity}
        setMessage={setMessage}
        saveAction={saveAction}
        setSaveAction={setSaveAction}
        setEditMode={undefined}
        redirectToIndexOnSave={false} /> */}

      <DeleteDialog
        open={deleteDialogOpen}
        type='slideshow'
        name={slideshow.name}
        setOpen={setDeleteDialogOpen}
        setDeleteConfirmed={setDeleteAction} />

      <UndeleteDialog
        open={undeleteDialogOpen}
        name={slideshow.name}
        setOpen={setUndeleteDialogOpen}
        setUndeleteConfirmed={setUndeleteAction} />
    </div>
  )
}
