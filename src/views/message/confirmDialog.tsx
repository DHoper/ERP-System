import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'
import * as React from 'react'

export default function ConfirmationDialog({ open, onClose, onConfirm }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirmation</DialogTitle>
      <DialogContent>
        <p>Are you sure you want to proceed?</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary'>
          Cancel
        </Button>
        <Button onClick={onConfirm} color='primary'>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}
