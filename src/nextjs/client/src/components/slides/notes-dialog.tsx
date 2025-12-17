import { Typography } from '@mui/material'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

interface Props {
  open: boolean
  setOpen: any
  text: string
}

export default function NotesDialog({
                          open,
                          setOpen,
                          text
                        }: Props) {

  // Functions
  const handleClose = () => {
    setOpen(false)
  }

  // Render
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='notes-dialog-title'
      aria-describedby='notes-dialog-description'>
      <DialogTitle id='notes-dialog-title'>
        Notes
      </DialogTitle>
      <DialogContent>

        <div style={{ marginBottom: '1em', textAlign: 'left' }}>
          <Typography
            style={{ marginBottom: '1em' }}
            sx={{ whiteSpace: 'pre-wrap' }}
            variant='h5'>
            {text}
          </Typography>
        </div>

      </DialogContent>
      <DialogActions>
        <Button variant='outlined' onClick={handleClose} autoFocus>Close</Button>
      </DialogActions>
    </Dialog>
  )
}
