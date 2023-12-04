import { Dialog, DialogTitle, DialogContent, DialogActions, Button, DialogContentText } from '@mui/material'
import { useState } from 'react'

const createPromise = () => {
  let resolver

  return [
    new Promise((resolve, reject) => {
      resolver = resolve
    }),
    resolver
  ]
}

const useConfirm = () => {
  const [open, setOpen] = useState(false)
  const [resolver, setResolver] = useState({ resolver: null })
  const [label, setLabel] = useState('')
  const [content, setContent] = useState('')

  const getConfirmation = async (label: string, content = '') => {
    setLabel(label)
    setContent(content)
    setOpen(true)
    const [promise, resolve] = await createPromise()
    setResolver({ resolve })

    return promise
  }

  const onClick = async status => {
    setOpen(false)
    resolver.resolve(status)
  }

  const WarningConfirmDialog = () => (
    <Dialog
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
      open={open}
      onClose={() => onClick(false)}
      PaperProps={{
        style: {
          border: '1px solid red',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 600 }} color={'error'}>
        {label}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description' sx={{ fontSize: '1rem' }} color={'error'}>
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ gap: '1.5rem', marginTop: '.5rem' }}>
        <Button color='secondary' autoFocus onClick={() => onClick(false)}>
          取消
        </Button>
        <Button color='error' variant='contained' onClick={() => onClick(true)}>
          確認
        </Button>
      </DialogActions>
    </Dialog>
  )

  return [getConfirmation, WarningConfirmDialog]
}

export default useConfirm
