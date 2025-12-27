import { Button, Dialog, Typography } from '@mui/material'
import { DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { BaseDataTypes } from '@/shared/types/base-data-types'

interface Props {
  open: boolean
  setOpen: any
  analysis: any
  setAnalysis: any
  setSaveAction: any
}

export default function UnpublishDialog({
                          open,
                          setOpen,
                          analysis,
                          setAnalysis,
                          setSaveAction
                        }: Props) {

  // Functions
  const handleClose = () => {
    setOpen(false)
  }

  const handleUnpublish = () => {

    // Set Analyis status
    analysis.status = BaseDataTypes.newStatus
    setAnalysis(analysis)

    // Save
    setSaveAction(true)

    // Close dialog
    setOpen(false)
  }

  // Render
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='unpublish-title'
      aria-describedby='unpublish-description'>
      <DialogTitle id='unpublish-title'>
        Unpublish
      </DialogTitle>
      <DialogContent>

        <div style={{ marginBottom: '1em', textAlign: 'left' }}>

          <Typography variant='body1'>
            Are you sure you want to unpublish this analysis?
            <br/><br/>
            Any generated {/*results and*/} slideshows will remain. If you later
            publish this record again existing {/*results and*/} slideshows may not
            match the latest prompt.
          </Typography>
        </div>

      </DialogContent>
      <DialogActions>
        <Button variant='outlined' onClick={handleUnpublish} autoFocus>Unpublish</Button>
        <Button variant='outlined' onClick={handleClose} autoFocus>Close</Button>
      </DialogActions>
    </Dialog>
  )
}
