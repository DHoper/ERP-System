import { Stack, Avatar, Button, styled, Dialog, Box, Typography } from '@mui/material'
import { useState } from 'react'
import ImageCrop from './imageUpload/ImageCrop'

const AvatarImage = ({ avatarImgUrl, onChange, disabled }) => {
  const [showImageCrop, setShowImageCrop] = useState(false)
  const [imgFile, setImgFile] = useState<FileList>()
  const [avatatUrl, setAvatarUrl] = useState<string>(avatarImgUrl || '')

  const handleSlectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImgFile(e.target.files)
      setShowImageCrop(true)
    }
  }

  const handleClose = (url: string) => {
    setShowImageCrop(false)
    setAvatarUrl(url)
    onChange('avatarImgUrl', url)
  }

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1
  })

  return (
    <>
      <Stack sx={{ justifyContent: { xs: 'center', xl: 'start' } }} spacing={6} direction={'row'}>
        <Avatar
          alt="User's Avatar"
          src={avatatUrl}
          sx={{ width: 150, height: 150, filter: disabled ? 'saturate(20%)' : null }}
        />
        <Stack spacing={4} justifyContent={'center'}>
          <Button component='label' variant='contained' disableElevation size='small' disabled={disabled}>
            上傳頭像
            <VisuallyHiddenInput onChange={handleSlectFile} type='file' />
          </Button>
          <Typography variant='subtitle2' color='initial' sx={{ color: disabled ? '#bdbdbd' : null }}>
            可接受格式: PNG & JPEG
          </Typography>
        </Stack>
      </Stack>
      <Dialog open={showImageCrop}>
        <Box>{showImageCrop ? <ImageCrop file={imgFile!} onClose={handleClose} /> : null}</Box>
      </Dialog>
    </>
  )
}

export default AvatarImage
