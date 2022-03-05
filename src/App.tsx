import { CSSProperties, useEffect, useMemo, useRef, useState } from 'react'
import { Flipper, Flipped } from 'react-flip-toolkit'
import toast, { Toaster } from 'react-hot-toast'
import useKeyPress from 'react-use/lib/useKeyPress'

import { abs, stringify } from './utils'

function App() {
  const [mapWidth, mapHeight] = useMemo(() => [8, 4], [])

  const touchStartRef = useRef<Pick<TouchList[number], 'identifier' | 'clientX' | 'clientY'> | null>(null)
  const [swipeDistance, setSwipeDistance] = useState<[number, number]>([0, 0])
  const [swipeDX, swipeDY] = swipeDistance

  const swipeThreshold = 32
  const isSwipeHorizontal = abs(swipeDX) > swipeThreshold && abs(swipeDX) > abs(swipeDY)
  const isSwipeVertical = abs(swipeDY) > swipeThreshold && abs(swipeDX) < abs(swipeDY)
  const isSwipeUp = isSwipeVertical && swipeDY < 0
  const isSwipeLeft = isSwipeHorizontal && swipeDX < 0
  const isSwipeDown = isSwipeVertical && swipeDY > 0
  const isSwipeRight = isSwipeHorizontal && swipeDX > 0

  const [cameraPosition, setCameraPosition] = useState<[number, number]>([0, 0])
  const [cameraX, cameraY] = cameraPosition

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

      setSwipeDistance([clientX - touchStart.clientX, clientY - touchStart.clientY])
    }

    document.addEventListener('touchend', onTouchEnd, { passive: false })
    return () => {
      document.removeEventListener('touchend', onTouchEnd)
    }
  }, [])

  const [key_ArrowUp] = useKeyPress('ArrowUp')
  const [key_ArrowLeft] = useKeyPress('ArrowLeft')
  const [key_ArrowDown] = useKeyPress('ArrowDown')
  const [key_ArrowRight] = useKeyPress('ArrowRight')

  useEffect(() => {
    if (key_ArrowUp || isSwipeUp) setCameraPosition(([cx, cy]) => [cx, cy - 1])
  }, [key_ArrowUp, swipeDistance])
  useEffect(() => {
    if (key_ArrowLeft || isSwipeLeft) setCameraPosition(([cx, cy]) => [cx - 1, cy])
  }, [key_ArrowLeft, swipeDistance])
  useEffect(() => {
    if (key_ArrowDown || isSwipeDown) setCameraPosition(([cx, cy]) => [cx, cy + 1])
  }, [key_ArrowDown, swipeDistance])
  useEffect(() => {
    if (key_ArrowRight || isSwipeRight) setCameraPosition(([cx, cy]) => [cx + 1, cy])
  }, [key_ArrowRight, swipeDistance])

  const mapCSS: CSSProperties = {
    left: `${-100 * cameraX}%`,
    top: `${-100 * cameraY}%`,
    width: `${100 * mapWidth}%`,
    height: `${100 * mapHeight}%`,
  }
  const mapRowCSS: CSSProperties = {
    width: `${100 / mapWidth}%`,
    height: `${100 / mapHeight}%`,
  }

  const elCamera = (
    <div className="relative aspect-square portrait:w-1/2 landscape:h-1/2 outline">
      <Flipper flipKey={stringify(cameraPosition)} spring="noWobble">
        <Flipped flipId="map">
          <div className="absolute w-full h-full bg-green-500" style={mapCSS}>
            {[...Array(mapHeight)].map((_, y) => (
              <div key={`${y}`} className="flex bg-red-500" style={mapRowCSS}>
                {[...Array(mapWidth)].map((_, x) => (
                  <div
                    key={`${x}`}
                    className="w-full h-full shrink-0 bg-green-400 outline-dotted"
                    onClick={() => toast(`Clicked tile ${stringify([x, y])}`)}
                  ></div>
                ))}
              </div>
            ))}
          </div>
        </Flipped>
      </Flipper>
    </div>
  )

  const elPassiveNotificationsToaster = <Toaster position="bottom-right" />

  const elDebug = (
    <div className="fixed left-0 top-0 bg-red-500/30">
      <pre>
        {stringify(
          {
            swipeDistance,
            isSwipeHorizontal,
            isSwipeVertical,
            isSwipeUp,
            isSwipeLeft,
            isSwipeDown,
            isSwipeRight,
            cameraPosition,
          },
          null,
          2,
        )}
      </pre>
    </div>
  )

  return (
    <>
      <div className="absolute w-full h-full overflow-hidden">
        <div className="absolute w-full h-full bg-gradient-to-b from-blue-600 to-blue-300" />
        <div className="absolute w-full h-full flex justify-center items-center">{elCamera}</div>
      </div>

      {elPassiveNotificationsToaster}
      {/* {elDebug} */}
    </>
  )
}

export default App
