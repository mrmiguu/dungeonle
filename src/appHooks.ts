import { DependencyList, useCallback, useEffect, useRef } from 'react'
import { abs } from './utils'

function useKey(map: { [key: string]: () => void }, deps?: DependencyList) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      map[e.key]?.()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, deps)
}

type Touch = 'touch'
type Swipe = 'swipeup' | 'swipeleft' | 'swipedown' | 'swiperight'

function useTouch(map: Partial<{ [key in Touch | Swipe]: () => void }>, deps?: DependencyList) {
  const touchStartRef = useRef<Pick<TouchList[number], 'identifier' | 'clientX' | 'clientY'> | null>(null)

  const onTouch = useCallback((swipeDX: number, swipeDY: number) => {
    const swipeThreshold = 32

    const swipedHorizontally = abs(swipeDX) > swipeThreshold && abs(swipeDX) > abs(swipeDY)
    const swipedVertically = abs(swipeDY) > swipeThreshold && abs(swipeDX) < abs(swipeDY)

    const swipedUp = swipedVertically && swipeDY < 0
    const swipedLeft = swipedHorizontally && swipeDX < 0
    const swipedDown = swipedVertically && swipeDY > 0
    const swipedRight = swipedHorizontally && swipeDX > 0

    if (swipedUp) map.swipeup?.()
    else if (swipedLeft) map.swipeleft?.()
    else if (swipedDown) map.swipedown?.()
    else if (swipedRight) map.swiperight?.()
    else map.touch?.()
  }, deps ?? [])

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

      onTouch(clientX - touchStart.clientX, clientY - touchStart.clientY)
    }

    document.addEventListener('touchend', onTouchEnd, { passive: false })
    return () => {
      document.removeEventListener('touchend', onTouchEnd)
    }
  }, [onTouch])
}

type Input = 'tap' | 'up' | 'left' | 'down' | 'right'

function useInput(map: Partial<{ [key in Input]: () => void }>, deps?: DependencyList) {
  useKey(
    {
      [' ']() {
        map.tap?.()
      },
      ArrowUp() {
        map.up?.()
      },
      ArrowLeft() {
        map.left?.()
      },
      ArrowDown() {
        map.down?.()
      },
      ArrowRight() {
        map.right?.()
      },
    },
    deps,
  )

  useTouch(
    {
      touch() {
        map.tap?.()
      },
      swipeup() {
        map.down?.()
      },
      swipeleft() {
        map.right?.()
      },
      swipedown() {
        map.up?.()
      },
      swiperight() {
        map.left?.()
      },
    },
    deps,
  )
}

export { useInput }
