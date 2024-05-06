import React, {  useState } from 'react'
import { styled, keyframes } from '@mui/system'
import { Box, Button, Stack } from '@mui/material'

// Keyframes

const circleAnimation = keyframes`
  0% {
    transform: scale(1)  translate(-50%, -50%);
  }
  100% {
    transform: scale(0) translate(-50%, -50%);
  }
`

const mailAnimation = keyframes`
    0% {
        stroke-dashoffset: 0;
    } 
    100% {
        stroke-dashoffset: 320; 
        }
`

const flyAnimation = keyframes`
  0%, 20% {
    transform: scale(1) translate3d(-50%, -50%, 0);
    transform-origin: 0% 0%;
    opacity: 1;
  }
  0% {
    stroke-dashoffset: 320
  }
  50% {
    opacity: 0.7;
    stroke-dashoffset: 0
  }
  100% {
    transform: scale(0) translate3d(250%, -300%, 0);
    transform-origin: 200% -200%;
    opacity: 0;
  }
`

// Styled components
const Frame = styled('div')({
  position: 'relative',
  width: '12.5rem',
  height: '12.5rem',
  marginBottom: '4rem',
  borderRadius: '2px',
  overflow: 'hidden',
  color: '#333',
  fontFamily: '"Open Sans", Helvetica, sans-serif'
})

const StyledButton = styled(Button)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '50%',
  padding: '.5rem 0',
  background: '#fff',
  borderRadius: '1.25rem',
  fontSize: '1rem',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  cursor: 'pointer',
  color: '#1abc9c',
  transition: 'all .5s ease',
  '&.reset': {
    opacity: 0,
    zIndex: 2
  },
  '&:hover': {
    background: '#1abc9c',
    color: '#fff'
  }
})

const CircleBlack = styled('div')({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate3d(-50%, -50%, 0)',
  width: '100%',
  height: '100%',
  borderRadius: '99em',
  background: '#2c3e50',
  transformOrigin: 'top left'
})

const Icon = styled('svg')({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate3d(-50%, -50%, 0)',
  strokeWidth: '2px',
  stroke: '#ecf0f1',
  strokeLinecap: 'square',
  strokeDasharray: 320,
  fill: 'none'
})

const MailAirplane = () => {
  const [isSend, setIsSend] = useState<boolean>()
  const [resendCounter, setResendCounter] = useState<number>(0)

  const Circle = styled('div')({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate3d(-50%, -50%, 0)',
    width: '100%',
    height: '100%',
    borderRadius: '99em',
    background: '#354a5f',
    transformOrigin: 'top left',

    animation: isSend ? `${circleAnimation} 1s ease-in-out both` : 'none'
  })

  const CircleOuter = styled(Circle)({
    background: 'none',
    border: '0.25rem solid #354a5f',

    animation: isSend ? `${circleAnimation} 1s ease-in-out both 0.5s` : 'none'
  })

  const MailIcon = styled(Icon)({
    width: '7.8rem',
    height: '4.5rem',
    opacity: !!resendCounter ? 0 : 1,
    animation: isSend ? `${mailAnimation} 1s ease-in-out forwards, steps(1000)` : 'none'
  })

  const PlaneIcon = styled(Icon)({
    width: '7.8rem',
    height: '7rem',
    marginTop: '1.2rem',
    strokeDashoffset: 320,
    opacity: !!resendCounter ? 0 : 1,

    animation: isSend ? `${flyAnimation} 1.6s ease-in-out 0.7s both, steps(1000)` : 'none'
  })

  const FinshHint = styled('div')({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate3d(-50%, -50%, 0)',
    color: 'white',
    width: '100%',
    textAlign: 'center',
    opacity: resendCounter ? 1 : 0
  })

  const minutes = Math.floor((60000 - resendCounter) / 60000)
  const seconds = Math.floor(((60000 - resendCounter) % 60000) / 1000)
  const resendCounterHint = `${minutes}分${seconds < 10 ? '0' : ''}${seconds}秒`

  const handleClick = () => {
    setIsSend(prev => !prev)
    setTimeout(() => {
      setResendCounter(0)
      setIsSend(prev => !prev)
      setResendCounter(prevCounter => prevCounter + 1)
      const timer = setInterval(() => {
        setResendCounter(prevCounter => prevCounter + 1000)
      }, 1000)

      setTimeout(() => {
        clearInterval(timer)
        setResendCounter(0)
      }, 60000)
    }, 2200)
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <Frame>
          <CircleBlack></CircleBlack>
          <Circle className='circle' />
          <CircleOuter className='circle-outer' />
          <MailIcon className='icon mail'>
            <polyline points='119,1 119,69 1,69 1,1'></polyline>
            <polyline points='119,1 60,45 1,1 119,1'></polyline>
          </MailIcon>
          <PlaneIcon className='icon plane'>
            <polyline points='119,1 1,59 106,80 119,1'></polyline>
            <polyline points='119,1 40,67 43,105 69,73'></polyline>
          </PlaneIcon>
          <FinshHint>
            <p>認證信已寄出</p>
            <p>請前往完成認證</p>
          </FinshHint>
        </Frame>
        <Stack spacing={4} sx={{ width: '100%' }} alignItems={'center'}>
          <StyledButton
            className='button'
            onClick={handleClick}
            disabled={!!resendCounter}
            sx={{ border: !!resendCounter ? '#9e9e9e 2px solid' : '#1abc9c 2px solid' }}
          >
            {!resendCounter ? '發送認證信' : '重新發送' + resendCounterHint}
          </StyledButton>
          <StyledButton
            className='button'
            onClick={handleClick}
            disabled={!resendCounter}
            sx={{ border: !resendCounter ? '#9e9e9e 2px solid' : '#1abc9c 2px solid' }}
          >
            下一步
          </StyledButton>
        </Stack>
      </Box>
    </>
  )
}

export default MailAirplane
