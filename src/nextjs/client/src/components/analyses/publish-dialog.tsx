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

export default function PublishDialog({
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

  const handlePublish = () => {

    // Set Analyis status
    analysis.status = BaseDataTypes.activeStatus
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
      aria-labelledby='publish-title'
      aria-describedby='publish-description'>
      <DialogTitle id='publish-title'>
        Publish
      </DialogTitle>
      <DialogContent>

        <div style={{ marginBottom: '1em', textAlign: 'left' }}>

          <Typography variant='body1'>
            Are you sure you're ready to publish this analysis?
            <br/><br/>
            This will generate results and slideshows based on this analysis.
            The generation process takes a few minutes, first for the results
            and then for the slideshows.
          </Typography>
        </div>

      </DialogContent>
      <DialogActions>
        <Button variant='outlined' onClick={handlePublish} autoFocus>Publish</Button>
        <Button variant='outlined' onClick={handleClose} autoFocus>Close</Button>
      </DialogActions>
    </Dialog>
  )
}
