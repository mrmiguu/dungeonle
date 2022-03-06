import { CSSProperties, useEffect, useMemo, useState } from 'react'
import { Flipper, Flipped } from 'react-flip-toolkit'
import toast, { Toaster } from 'react-hot-toast'

import { useGenericDocumentInput } from './appHooks'
import EmojiMonster from './EmojiMonster'
import { emojis } from './emojis'
import { stringify } from './utils'

function App() {
  const [mapWidth, mapHeight] = useMemo(() => [8, 4], [])

  const [cameraPosition, setCameraPosition] = useState<[number, number]>([0, 0])
  const [cameraX, cameraY] = cameraPosition

  const { inputTimestamp, inputUpTimestamp, inputLeftTimestamp, inputDownTimestamp, inputRightTimestamp } =
    useGenericDocumentInput()

  useEffect(() => {
    if (inputTimestamp) toast('4625')
  }, [inputTimestamp])
  useEffect(() => {
    if (inputUpTimestamp) setCameraPosition([cameraX, cameraY - 1])
  }, [inputUpTimestamp])
  useEffect(() => {
    if (inputLeftTimestamp) setCameraPosition([cameraX - 1, cameraY])
  }, [inputLeftTimestamp])
  useEffect(() => {
    if (inputDownTimestamp) setCameraPosition([cameraX, cameraY + 1])
  }, [inputDownTimestamp])
  useEffect(() => {
    if (inputRightTimestamp) setCameraPosition([cameraX + 1, cameraY])
  }, [inputRightTimestamp])

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
                {[...Array(mapWidth)].map((_, x) => {
                  const emoji = emojis[(y * mapWidth + x) % emojis.length]!

                  return (
                    <div
                      key={`${x}`}
                      className="relative w-full h-full shrink-0 flex justify-center items-center bg-green-400 outline-dotted"
                      onClick={() => toast(`Clicked tile ${stringify([x, y])}`)}
                    >
                      <div className="flex justify-center items-end">
                        <EmojiMonster emoji={emoji} className="absolute text-9xl" />
                      </div>
                    </div>
                  )
                })}
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
            inputUpTimestamp,
            inputLeftTimestamp,
            inputDownTimestamp,
            inputRightTimestamp,
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
