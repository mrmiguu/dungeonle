import { useEffect, useRef, useState } from 'react'
import { abs } from './utils'

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

export { useDocumentTouch }
