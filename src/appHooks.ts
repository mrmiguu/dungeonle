import { useEffect, useRef, useState } from 'react'
import useKeyPress from 'react-use/lib/useKeyPress'

import { abs, max } from './utils'

function useDocumentTouch() {
  const touchStartRef = useRef<Pick<TouchList[number], 'identifier' | 'clientX' | 'clientY'> | null>(null)
  const [swipedUpTimestamp, setSwipedUpTimestamp] = useState(0)
  const [swipedLeftTimestamp, setSwipedLeftTimestamp] = useState(0)
  const [swipedDownTimestamp, setSwipedDownTimestamp] = useState(0)
  const [swipedRightTimestamp, setSwipedRightTimestamp] = useState(0)

  function onSwipe(swipeDX: number, swipeDY: number) {
    const swipeThreshold = 32

    const swipedHorizontally = abs(swipeDX) > swipeThreshold && abs(swipeDX) > abs(swipeDY)
    const swipedVertically = abs(swipeDY) > swipeThreshold && abs(swipeDX) < abs(swipeDY)

    const swipedUpTimestamp = swipedVertically && swipeDY < 0
    const swipedLeftTimestamp = swipedHorizontally && swipeDX < 0
    const swipedDownTimestamp = swipedVertically && swipeDY > 0
    const swipedRightTimestamp = swipedHorizontally && swipeDX > 0

    if (swipedUpTimestamp) setSwipedUpTimestamp(Date.now())
    if (swipedLeftTimestamp) setSwipedLeftTimestamp(Date.now())
    if (swipedDownTimestamp) setSwipedDownTimestamp(Date.now())
    if (swipedRightTimestamp) setSwipedRightTimestamp(Date.now())
  }

  useEffect(() => {
    function onTouchStart(e: TouchEvent) {
      const { identifier, clientX, clientY } = e.touches[0]!
      touchStartRef.current = { identifier, clientX, clientY }
    }

    document.addEventListener('touchstart', onTouchStart, { passive: false })
    return () => {
      document.removeEventListener('touchstart', onTouchStart)
    }
  }, [])

  useEffect(() => {
    function onTouchMove(e: TouchEvent) {
      e.preventDefault()
    }

    document.addEventListener('touchmove', onTouchMove, { passive: false })
    return () => {
      document.removeEventListener('touchmove', onTouchMove)
    }
  }, [])

  useEffect(() => {
    function onTouchEnd(e: TouchEvent) {
      const { identifier, clientX, clientY } = e.changedTouches[0]!
      const touchStart = touchStartRef.current

      if (!touchStart || touchStart.identifier !== identifier) return

      onSwipe(clientX - touchStart.clientX, clientY - touchStart.clientY)
    }

    document.addEventListener('touchend', onTouchEnd, { passive: false })
    return () => {
      document.removeEventListener('touchend', onTouchEnd)
    }
  }, [])

  return {
    swipedUpTimestamp,
    swipedLeftTimestamp,
    swipedDownTimestamp,
    swipedRightTimestamp,
  }
}

function useDocumentKeyPress() {
  const [key_ArrowUp] = useKeyPress('ArrowUp')
  const [key_ArrowLeft] = useKeyPress('ArrowLeft')
  const [key_ArrowDown] = useKeyPress('ArrowDown')
  const [key_ArrowRight] = useKeyPress('ArrowRight')

  const [pressedUpTimestamp, setPressedUpTimestamp] = useState(0)
  const [pressedLeftTimestamp, setPressedLeftTimestamp] = useState(0)
  const [pressedDownTimestamp, setPressedDownTimestamp] = useState(0)
  const [pressedRightTimestamp, setPressedRightTimestamp] = useState(0)

  useEffect(() => {
    if (key_ArrowUp) setPressedUpTimestamp(Date.now())
  }, [key_ArrowUp])
  useEffect(() => {
    if (key_ArrowLeft) setPressedLeftTimestamp(Date.now())
  }, [key_ArrowLeft])
  useEffect(() => {
    if (key_ArrowDown) setPressedDownTimestamp(Date.now())
  }, [key_ArrowDown])
  useEffect(() => {
    if (key_ArrowRight) setPressedRightTimestamp(Date.now())
  }, [key_ArrowRight])

  return {
    pressedUpTimestamp,
    pressedLeftTimestamp,
    pressedDownTimestamp,
    pressedRightTimestamp,
  }
}

function useGenericDocumentInput() {
  const { swipedUpTimestamp, swipedLeftTimestamp, swipedDownTimestamp, swipedRightTimestamp } = useDocumentTouch()
  const { pressedUpTimestamp, pressedLeftTimestamp, pressedDownTimestamp, pressedRightTimestamp } =
    useDocumentKeyPress()

  const [inputUpTimestamp, setInputUpTimestamp] = useState(0)
  const [inputLeftTimestamp, setInputLeftTimestamp] = useState(0)
  const [inputDownTimestamp, setInputDownTimestamp] = useState(0)
  const [inputRightTimestamp, setInputRightTimestamp] = useState(0)

  useEffect(() => {
    if (swipedUpTimestamp || pressedUpTimestamp) setInputUpTimestamp(max(swipedUpTimestamp, pressedUpTimestamp))
  }, [swipedUpTimestamp, pressedUpTimestamp])
  useEffect(() => {
    if (swipedLeftTimestamp || pressedLeftTimestamp)
      setInputLeftTimestamp(max(swipedLeftTimestamp, pressedLeftTimestamp))
  }, [swipedLeftTimestamp, pressedLeftTimestamp])
  useEffect(() => {
    if (swipedDownTimestamp || pressedDownTimestamp)
      setInputDownTimestamp(max(swipedDownTimestamp, pressedDownTimestamp))
  }, [swipedDownTimestamp, pressedDownTimestamp])
  useEffect(() => {
    if (swipedRightTimestamp || pressedRightTimestamp)
      setInputRightTimestamp(max(swipedRightTimestamp, pressedRightTimestamp))
  }, [swipedRightTimestamp, pressedRightTimestamp])

  return {
    inputUpTimestamp,
    inputLeftTimestamp,
    inputDownTimestamp,
    inputRightTimestamp,
  }
}

export { useDocumentTouch, useDocumentKeyPress, useGenericDocumentInput }
