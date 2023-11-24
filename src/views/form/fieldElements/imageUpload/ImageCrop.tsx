import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop'
import { useDebounceEffect } from './useDebounceEffect'

import 'react-image-crop/dist/ReactCrop.css'
import { useState, useRef } from 'react'
import { Button, Stack, Typography, Container, Slider } from '@mui/material'

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Failed to convert Blob to Base64'))
      }
    }
    reader.readAsDataURL(blob)
  })
}

export default function ImageCrop(props: { file: FileList; onClose: (url: string, blob: Blob) => void }) {
  const [imgSrc, setImgSrc] = useState('')
  const imgRef = useRef<HTMLImageElement>(null)
  const blobUrlRef = useRef('')
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [scale, setScale] = useState(1)
  const [rotate, setRotate] = useState(0)

  async function handleFinished() {
    const image = imgRef.current

    if (!image || !completedCrop || !crop) {
      return
    }

    const offscreen = new OffscreenCanvas(completedCrop.width, completedCrop.height)

    const scaleX = image.naturalWidth / image.width //圖片縮放倍率
    const scaleY = image.naturalHeight / image.height

    const ctx = offscreen.getContext('2d')
    if (!ctx) {
      throw new Error('No 2d context')
    }
    const pixelRatio = window.devicePixelRatio

    offscreen.width = Math.floor(completedCrop.width * scaleX * pixelRatio) //將畫布寬高依圖片縮放倍率調整
    offscreen.height = Math.floor(completedCrop.height * scaleY * pixelRatio)

    ctx.scale(pixelRatio, pixelRatio)
    ctx.imageSmoothingQuality = 'high'

    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, offscreen.width, offscreen.height)

    const cropX = completedCrop.x * scaleX //將裁切座標依圖片縮放倍率調整
    const cropY = completedCrop.y * scaleY

    const rotateRads = rotate * (Math.PI / 180)

    const centerX = image.naturalWidth / 2
    const centerY = image.naturalHeight / 2

    ctx.save()

    ctx.translate(-cropX, -cropY)
    ctx.translate(centerX, centerY)
    ctx.rotate(rotateRads)
    ctx.scale(scale, scale)
    ctx.translate(-centerX, -centerY)
    ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, 0, 0, image.naturalWidth, image.naturalHeight)

    ctx.restore()

    const blob = await offscreen.convertToBlob({
      type: 'image/jpeg',
      quality: 0.8
    })

    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current)
    }
    blobUrlRef.current = URL.createObjectURL(blob)

    // const base64String = await blobToBase64(blob).then(base64String => {

    //   return base64String
    // })

    const blobBuffer = await blob.arrayBuffer()
    console.log(blob, 93)
    // const uint8Array = new Uint8Array(blobBuffer)

    function arrayBufferToHex(arrayBuffer) {
      const uint8Array = new Uint8Array(arrayBuffer)

      return Array.from(uint8Array)
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('')
    }

    

    const hexString = arrayBufferToHex(blobBuffer)
    console.log(hexString, 71);

    props.onClose(blobUrlRef.current, hexString)
  }

  function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
    return centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 100
        },
        aspect,
        mediaWidth,
        mediaHeight
      ),
      mediaWidth,
      mediaHeight
    )
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget
    setCrop(centerAspectCrop(width, height, 1))
  }

  useDebounceEffect(
    async () => {
      const reader = new FileReader()
      reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''))
      reader.readAsDataURL(props.file[0])
    },
    100,
    [completedCrop]
  )

  return (
    <>
      {!!imgSrc && (
        <Stack maxWidth='xs' alignItems={'center'} spacing={4} useFlexGap sx={{ padding: 4, paddingX: 8 }}>
          <Typography variant='h4'>裁切照片</Typography>
          <Container maxWidth='xs'>
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={c => c.width && setCompletedCrop(c)}
              aspect={1}
              minWidth={100}
              minHeight={100}
              keepSelection={true}
              circularCrop={true}
              style={{
                margin: 'auto',
                display: 'block',
                border: '2px solid black'
              }}
            >
              <img
                ref={imgRef}
                alt='Crop me'
                src={imgSrc}
                style={{
                  maxWidth: '20rem',
                  maxHeight: '20rem',
                  minWidth: '10rem',
                  width: 'auto',
                  height: 'auto',
                  transform: `scale(${scale}) rotate(${rotate}deg)`
                }}
                onLoad={onImageLoad}
              />
            </ReactCrop>
            <Stack direction={'row'} spacing={2} alignItems={'center'} sx={{ mt: 4 }}>
              <Typography sx={{ fontWeight: 'bold' }}>縮放</Typography>
              <Slider
                aria-label='Custom marks'
                step={0.1}
                min={0.1}
                max={2}
                valueLabelDisplay='auto'
                value={scale}
                onChange={(_e, v) => setScale(v)}
                size='small'
                sx={{ flex: '1' }}
              />
            </Stack>
            <Stack direction={'row'} spacing={2} alignItems={'center'}>
              <Typography sx={{ fontWeight: 'bold' }}>旋轉</Typography>
              <Slider
                aria-label='Custom marks'
                step={10}
                min={0}
                max={360}
                valueLabelDisplay='auto'
                value={rotate}
                onChange={(_e, v) => setRotate(v)}
                size='small'
                sx={{ flex: '1' }}
              />
            </Stack>
          </Container>

          <Button variant='contained' onClick={async () => handleFinished()}>
            完成
          </Button>
        </Stack>
      )}
    </>
  )
}
