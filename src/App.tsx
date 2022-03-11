import produce from 'immer'
import { CSSProperties, useEffect, useMemo, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { v4 as uuid4 } from 'uuid'
import { useInput } from './appHooks'
import Camera from './Camera'
import EmojiItem from './EmojiItem'
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
        [myUUId]: { emoji: '🍳', x: 0, y: 0, kind: 'monster' },
        [uuid4()]: { emoji: '🍎', x: 1, y: 1, kind: 'monster' },
        [uuid4()]: { emoji: '🪙', x: 1, y: 2, kind: 'item' },
        [uuid4()]: { emoji: '🪙', x: 2, y: 1, kind: 'item' },
        [uuid4()]: { emoji: '🪙', x: 3, y: 2, kind: 'item' },
        [uuid4()]: { emoji: '🪙', x: 4, y: 1, kind: 'item' },
        [uuid4()]: { emoji: '🪙', x: 5, y: 2, kind: 'item' },
        [uuid4()]: { emoji: '🪙', x: 6, y: 1, kind: 'item' },
      }),
    [myUUId],
  )

  const interact = (uuid = myUUId) => {
    playSound('hit.wav')
    toast('💥')
  }

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
      interact()
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
      {entries(sprites).map(([uuid, { emoji, x, y, kind }]) => (
        <div
          key={uuid}
          className="absolute top-0 left-0 flex items-center justify-center transition-transform duration-1250 ease-out-expo"
          style={{
            ...styleSpriteTile,
            transform: `translate(${100 * x}%,${100 * y}%)`,
            zIndex: y * 2 + (kind === 'monster' ? 1 : 0),
          }}
          onClick={() => toast(`Clicked tile ${stringify([x, y])}`)}
        >
          <div className="flex items-center justify-center">
            {kind === 'monster' && <EmojiMonster emoji={emoji} className="absolute w-full h-full" />}
            {kind === 'item' && <EmojiItem emoji={emoji} className="absolute w-2/5 h-2/5" />}
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
    <div key={`${y}`} className="flex" style={styleTileRow}>
      {[...Array(mapWidth)].map((_, x) => {
        const tr = x === mapWidth - 1 && y === 0
        const br = x === mapWidth - 1 && y === mapHeight - 1
        const bl = x === 0 && y === mapHeight - 1
        const tl = x === 0 && y === 0

        return (
          <div
            key={`${x}`}
            className={`relative flex items-center justify-center w-full h-full shrink-0 ${
              tr ? 'rounded-tr-full' : br ? 'rounded-br-full' : bl ? 'rounded-bl-full' : tl ? 'rounded-tl-full' : null
            } ${(x % 2 === 0 && y % 2 === 0) || (x % 2 === 1 && y % 2 === 1) ? 'bg-green-400' : 'bg-green-500'}`}
            onClick={() => toast(`Clicked tile ${stringify([x, y])}`)}
          >
            <div className="flex items-end justify-center">{/* TODO: add static tile things here */}</div>
          </div>
        )
      })}
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
