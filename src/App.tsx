import produce from 'immer'
import { CSSProperties, useEffect, useMemo, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { v4 as uuid4 } from 'uuid'
import { useInput } from './appHooks'
import Camera from './Camera'
import EmojiMonster from './EmojiMonster'
import { music_imports, useMusic } from './music'
import { random } from './random'
import { playSound } from './sounds'
import { SpriteMap } from './store'
import { entries, keys, stringify } from './utils'

function App() {
  // toast('<App>')

  const randomMusic = useMemo(() => {
    const musicPaths = keys(music_imports)
    return musicPaths[~~(random() * musicPaths.length)]!
  }, [])

  useMusic(randomMusic, true)

  const myUUId = useMemo(() => uuid4(), [])

  const [sprites, setSprites] = useState<SpriteMap>({})
  const mySprite = sprites[myUUId]

  useEffect(
    () =>
      void setSprites({
        [myUUId]: { emoji: '🍳', x: 0, y: 0 },
        [uuid4()]: { emoji: '🍎', x: 1, y: 1 },
      }),
    [myUUId],
  )

  const moveUp = (uuid = myUUId) => {
    playSound('move.wav')
    setSprites(
      produce<SpriteMap>(sprites => {
        sprites[uuid]!.y--
      }),
    )
  }
  const moveLeft = (uuid = myUUId) => {
    playSound('move.wav')
    setSprites(
      produce<SpriteMap>(sprites => {
        sprites[uuid]!.x--
      }),
    )
  }
  const moveDown = (uuid = myUUId) => {
    playSound('move.wav')
    setSprites(
      produce<SpriteMap>(sprites => {
        sprites[uuid]!.y++
      }),
    )
  }
  const moveRight = (uuid = myUUId) => {
    playSound('move.wav')
    setSprites(
      produce<SpriteMap>(sprites => {
        sprites[uuid]!.x++
      }),
    )
  }

  const [mapWidth, mapHeight] = useMemo(() => [8, 4], [])
  const tileWidth = 1 / mapWidth
  const tileHeight = 1 / mapHeight

  const { x: cameraX, y: cameraY } = mySprite ?? { x: 0, y: 0 }

  useInput({
    tap() {
      toast('💥')
    },
    up() {
      moveUp()
    },
    left() {
      moveLeft()
    },
    down() {
      moveDown()
    },
    right() {
      moveRight()
    },
  })

  const styleSpriteTile: CSSProperties = {
    width: `${100 * tileWidth}%`,
    height: `${100 * tileHeight}%`,
  }

  const elSprites = (
    <div className="absolute top-0 left-0 w-full h-full">
      {entries(sprites).map(([uuid, { emoji, x, y }]) => (
        <div
          key={uuid}
          className="absolute top-0 left-0 flex items-center justify-center transition-transform bg-yellow-400 duration-1250 ease-out-expo"
          style={{
            ...styleSpriteTile,
            transform: `translate(${100 * x}%,${100 * y}%)`,
            zIndex: y,
          }}
          onClick={() => toast(`Clicked tile ${stringify([x, y])}`)}
        >
          <div className="flex items-end justify-center">
            {<EmojiMonster emoji={emoji} className="absolute w-full h-full" />}
          </div>
        </div>
      ))}
    </div>
  )

  const styleTileRow: CSSProperties = {
    width: `${100 * tileWidth}%`,
    height: `${100 * tileHeight}%`,
  }

  const elTiles = [...Array(mapHeight)].map((_, y) => (
    <div key={`${y}`} className="flex bg-red-500" style={styleTileRow}>
      {[...Array(mapWidth)].map((_, x) => (
        <div
          key={`${x}`}
          className="relative flex items-center justify-center w-full h-full bg-green-400 shrink-0 outline-dotted"
          onClick={() => toast(`Clicked tile ${stringify([x, y])}`)}
        >
          <div className="flex items-end justify-center">{/* TODO: add static tile things here */}</div>
        </div>
      ))}
    </div>
  ))

  // const elDebug = (
  //   <div className="fixed top-0 left-0 bg-red-500/30">
  //     <pre>{stringify({ cameraPosition }, null, 2)}</pre>
  //   </div>
  // )

  return (
    <>
      <div className="absolute w-full h-full overflow-hidden">
        <div className="absolute w-full h-full bg-gradient-to-b from-blue-600 to-blue-300" />
        <div className="absolute flex items-center justify-center w-full h-full">
          <Camera
            x={cameraX}
            y={cameraY}
            tileWidth={tileWidth}
            tileHeight={tileHeight}
            mapWidth={mapWidth}
            mapHeight={mapHeight}
          >
            {elTiles}
            {elSprites}
          </Camera>
        </div>
      </div>

      <Toaster position="bottom-right" />
      {/* {elDebug} */}
    </>
  )
}

export default App
