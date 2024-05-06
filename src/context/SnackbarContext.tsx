import { IconButton, Snackbar } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

import React, { createContext, useState, useContext, ReactNode } from 'react'

type SnackbarContextType = {
  showSnackbar: (message: string, duration: number | null) => void
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined)

export const useSnackbarContext = () => {  // 使用自己並導出
  const context = useContext(SnackbarContext)
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider')
  }

  return context
}

export const SnackbarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState<string | undefined>()
  const [snackbarAutoHide, setSnackbarAutoHide] = useState<number | null>(600)

  const handleSnackbar = () => {
    setSnackbarOpen(prev => !prev)
  }

  const action = (
    <>
      <IconButton size='small' aria-label='close' color='inherit' onClick={handleSnackbar}>
        <CloseIcon fontSize='small' />
      </IconButton>
    </>
  )

  const showSnackbar = (message: string, duration: number | null) => {
    setSnackbarMessage(message)
    setSnackbarAutoHide(duration)
    setSnackbarOpen(true)
  }

  const value: SnackbarContextType = {
    showSnackbar
  }

  return (
    <SnackbarContext.Provider value={value}>
      {children}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={snackbarAutoHide}
        onClose={handleSnackbar}
        message={snackbarMessage}
        action={action}
        sx={{ '& .MuiSnackbar-root': { color: 'red' }, padding: '2rem' }}
      />
    </SnackbarContext.Provider>
  )
}
