import immer from 'immer'
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
import { entries, keys } from './utils'

const gradients = {
  normal: ['red', 'yellow'],
  critical: ['red', 'magenta'],
  self: ['indigo', 'magenta'],
  selfCritical: ['black', 'magenta'],
} as const

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

  useEffect(() => {
    setSprites(
      immer<SpriteMap>(sprites => {
        for (const coinUUId in sprites) {
          const coinItem = sprites[coinUUId]!

          if (coinItem.emoji === '🪙' && coinItem.kind === 'item') {
            for (const monsterUUId in sprites) {
              const { x, y, kind } = sprites[monsterUUId]!

              if (coinItem.x === x && coinItem.y === y && kind === 'monster') {
                playSound('coin.wav')
                toast(
                  <div className="flex items-center">
                    +<EmojiItem emoji="🪙" className="w-[8vmin] h-[8vmin]" />
                  </div>,
                  { duration: 750, toasterId: monsterUUId },
                )
                delete sprites[coinUUId]
              }
            }
          }
        }
      }),
    )
  }, [sprites])

  const interact = (uuid = myUUId) => {
    playSound('hit.wav')

    const dmg = ~~(random('💥') * 1000) + 100
    const gradient = gradients.normal

    toast(
      <div
        className="font-[DamageFont] font-bold text-[20vmin] leading-none text-transparent bg-clip-text"
        style={{
          backgroundImage: `linear-gradient(to bottom, ${gradient[0]} 30%, ${gradient[1]} 70%)`,
        }}
      >
        {dmg}
      </div>,
      {
        className: '-mt-[20vmin] p-0',
        duration: 500,
        toasterId: uuid,
      },
    )
  }

  const move = (mutate: (sprites: SpriteMap) => void) => {
    playSound('move.wav')
    setSprites(immer<SpriteMap>(mutate))
  }

  const moveUp = (uuid = myUUId) =>
    move(sprites => {
      sprites[uuid]!.y--
    })
  const moveLeft = (uuid = myUUId) =>
    move(sprites => {
      sprites[uuid]!.x--
    })
  const moveDown = (uuid = myUUId) =>
    move(sprites => {
      sprites[uuid]!.y++
    })
  const moveRight = (uuid = myUUId) =>
    move(sprites => {
      sprites[uuid]!.x++
    })

  const [mapWidth, mapHeight] = useMemo(() => [8, 4], [])
  const tileWidth = 1 / mapWidth
  const tileHeight = 1 / mapHeight

  const { x: cameraX, y: cameraY } = mySprite ?? { x: 0, y: 0 }

  useInput(
    {
      tap() {
        if (!mySprite) return

        for (const uuid in sprites) {
          const { x, y } = sprites[uuid]!
          if (x === mySprite.x && y === mySprite.y && uuid !== myUUId) interact(uuid)
        }
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
    },
    [sprites],
  )

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
          // onClick={() => toast(`Clicked tile ${stringify([x, y])}`)}
        >
          <div className="flex items-center justify-center">
            {kind === 'monster' && (
              <>
                <EmojiMonster emoji={emoji} className="absolute w-full h-full" />
                <Toaster
                  position="bottom-center"
                  containerStyle={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: `${100}%`,
                    height: `${100}%`,
                    transform: `translate(${0}%,${-100}%)`,
                  }}
                  reverseOrder
                  toasterId={uuid}
                />
              </>
            )}
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
            // onClick={() => toast(`Clicked tile ${stringify([x, y])}`)}
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

      {/* <Toaster /> */}

      {/* {elDebug} */}
    </>
  )
}

export default App
