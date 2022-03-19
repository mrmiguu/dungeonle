import immer from 'immer'
import { CSSProperties, useEffect, useMemo, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import Particles from 'react-tsparticles'
import { v4 as uuid4 } from 'uuid'
import { useInput } from './appHooks'
import Camera from './Camera'
import EmojiMapItem from './EmojiMapItem'
import EmojiNPC from './EmojiNPC'
import EmojiPlayer from './EmojiPlayer'
import { ItemEmoji, mapItemOverrides } from './emojis'
import EmojiStatic from './EmojiStatic'
import { drawMap, findTiles, getRawMap, getRawTile, tiles } from './maps'
import { mapSpritesToTiles } from './mapSprites'
import { music_imports, useMusic } from './music'
import { random } from './random'
import { playSound } from './sounds'
import { Sprite, SpriteMap } from './store'
import { entries, keys, log, max, stringify } from './utils'

const gradients = {
  normal: ['red', 'yellow'],
  critical: ['red', 'magenta'],
  self: ['indigo', 'magenta'],
  selfCritical: ['black', 'magenta'],
} as const

function App() {
  // toast('<App>')

  const rawMap = useMemo(() => getRawMap(24, 24), [])
  useEffect(() => {
    log(stringify(drawMap(rawMap), null, 2))
  }, [rawMap])

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
        ...mapSpritesToTiles(rawMap, tiles.player, () => ({
          uuid: myUUId,
          emoji: '😎',
          kind: 'player',
          action: null,
          items: {},
          hearts: 10000,
        })),
        ...mapSpritesToTiles(rawMap, tiles.monster, () => ({
          emoji: '🍎',
          kind: 'npc',
          action: null,
          items: { '❤️': 1 },
          hearts: 5000,
        })),
        ...mapSpritesToTiles(rawMap, tiles.miniboss, () => ({
          emoji: '🌲',
          kind: 'npc',
          action: null,
          items: { '❤️': 2, '🪙': 1 },
          hearts: 5000 * 20,
        })),
        ...mapSpritesToTiles(rawMap, tiles.boss, () => ({
          emoji: '🍍',
          kind: 'npc',
          action: null,
          items: { '❤️': 3, '🪙': 2 },
          hearts: 5000 * 20 * 5,
        })),
        ...mapSpritesToTiles(rawMap, tiles.warp, ({ i, n }) => ({ emoji: '🌐', kind: 'warp', to: (i + 1) % n })),
        ...mapSpritesToTiles(rawMap, tiles.coin, () => ({ emoji: '🪙', kind: 'item' })),
        ...mapSpritesToTiles(rawMap, tiles.chest, ({ i }) => ({ emoji: i === 0 ? '🗺️' : '🧭', kind: 'chest' })),
      }),
    [myUUId, rawMap],
  )

  function editSprites(on: (sprites: SpriteMap) => void) {
    setSprites(immer(sprites => on(sprites)))
  }

  function spriteOnSpriteEvent(
    on: (sprites: SpriteMap, subject: Sprite, object: Sprite, subjectUUId: string, objectUUId: string) => void,
  ) {
    editSprites(sprites => {
      for (const objectUUId in sprites) {
        const object = sprites[objectUUId]!

        for (const subjectUUId in sprites) {
          const subject = sprites[subjectUUId]!

          if (subject.x === object.x && subject.y === object.y) {
            on(sprites, subject, object, subjectUUId, objectUUId)
          }
        }
      }
    })
  }

  function processSprites() {
    spriteOnSpriteEvent((sprites, subject, object, subjectUUId, objectUUId) => {
      const isSelf = subjectUUId === objectUUId
      const subjectIsTapping = 'action' in subject && subject.action === 'tap'
      const subjectIsMovingUp = 'action' in subject && subject.action === 'up'
      const subjectIsMovingLeft = 'action' in subject && subject.action === 'left'
      const subjectIsMovingDown = 'action' in subject && subject.action === 'down'
      const subjectIsMovingRight = 'action' in subject && subject.action === 'right'
      const subjectIsCharacter = subject.kind === 'player' || subject.kind === 'npc'
      const objectIsCharacter = object.kind === 'player' || object.kind === 'npc'
      const objectIsChest = object.kind === 'chest'
      const objectIsItem = object.kind === 'item'
      const objectIsWarp = object.kind === 'warp'

      const moving =
        subjectIsCharacter &&
        (subjectIsMovingUp || subjectIsMovingLeft || subjectIsMovingDown || subjectIsMovingRight) &&
        isSelf
      const pickingUp = subjectIsCharacter && objectIsItem && !isSelf
      const openingChest = subjectIsCharacter && subjectIsTapping && objectIsChest && !isSelf
      const attackingCharacter = subjectIsCharacter && subjectIsTapping && objectIsCharacter && !isSelf
      const warping = subjectIsCharacter && objectIsWarp && subjectIsTapping && !isSelf

      if (moving) {
        playSound('move.wav')

        if (subjectIsMovingUp) subject.y--
        if (subjectIsMovingLeft) subject.x--
        if (subjectIsMovingDown) subject.y++
        if (subjectIsMovingRight) subject.x++

        subject.action = null
      }

      if (pickingUp) {
        const { sound, animationDuration } = mapItemOverrides[object.emoji] ?? {}

        if (sound) playSound(sound)
        else playSound('pickup.mp3')

        toast(
          <div className="flex items-center">
            +<EmojiStatic emoji={object.emoji} className="w-[8vmin] h-[8vmin]" />
          </div>,
          { duration: animationDuration ?? 1000, toasterId: subjectUUId },
        )

        subject.items[object.emoji] = (subject.items[object.emoji] ?? 0) + 1
        delete sprites[objectUUId]
      }

      if (openingChest) {
        playSound('openchest.mp3')

        toast(
          <div className="flex items-center">
            +<EmojiStatic emoji={object.emoji} className="w-[8vmin] h-[8vmin]" />
          </div>,
          { duration: 1750, toasterId: subjectUUId },
        )

        subject.items[object.emoji] = (subject.items[object.emoji] ?? 0) + 1
        subject.action = null
        delete sprites[objectUUId]
      }

      if (attackingCharacter) {
        playSound('hit.wav')

        const dmg = ~~(random() * 1000) + 100
        const gradient = gradients.normal

        toast(
          <div
            className="font-[DamageFont] font-bold text-[20vmin] leading-none px-2 text-transparent bg-clip-text"
            style={{
              backgroundImage: `linear-gradient(to bottom, ${gradient[0]} 30%, ${gradient[1]} 70%)`,
            }}
          >
            {dmg}
          </div>,
          {
            className: '-mt-[20vmin] p-0',
            duration: 500,
            toasterId: objectUUId,
          },
        )

        object.hearts = max(object.hearts - dmg, 0)

        if (!object.hearts) {
          for (const _emoji in object.items) {
            const emoji = _emoji as ItemEmoji
            const count = object.items[emoji]!

            for (let c = 0; c < count; c++) {
              sprites[uuid4()] = {
                kind: 'item',
                emoji,
                x: object.x,
                y: object.y,
              }
            }
          }

          delete sprites[objectUUId]
        }

        subject.action = null
      }

      if (warping) {
        playSound('warp.wav')

        const [toX, toY] = findTiles(tiles.warp, rawMap)[object.to]!

        subject.action = null
        subject.x = toX
        subject.y = toY
      }
    })
  }

  useEffect(() => {
    processSprites()
  }, [sprites])

  function haveSpriteTap(uuid: string) {
    editSprites(sprites => {
      const sprite = sprites[uuid]
      if (sprite && 'action' in sprite) sprite.action = 'tap'
    })
  }

  const haveSpriteMoveUp = (uuid: string) =>
    editSprites(sprites => {
      const sprite = sprites[uuid]!
      if ('action' in sprite) sprite.action = 'up'
    })
  const haveSpriteMoveLeft = (uuid: string) =>
    editSprites(sprites => {
      const sprite = sprites[uuid]!
      if ('action' in sprite) sprite.action = 'left'
    })
  const haveSpriteMoveDown = (uuid: string) =>
    editSprites(sprites => {
      const sprite = sprites[uuid]!
      if ('action' in sprite) sprite.action = 'down'
    })
  const haveSpriteMoveRight = (uuid: string) =>
    editSprites(sprites => {
      const sprite = sprites[uuid]!
      if ('action' in sprite) sprite.action = 'right'
    })

  const [mapWidth, mapHeight] = useMemo(() => [8, 4], [])
  const tileWidth = 1 / mapWidth
  const tileHeight = 1 / mapHeight

  const { x: cameraX, y: cameraY } = mySprite ?? { x: 0, y: 0 }

  useInput(
    {
      tap() {
        haveSpriteTap(myUUId)
      },
      up() {
        haveSpriteMoveUp(myUUId)
      },
      left() {
        haveSpriteMoveLeft(myUUId)
      },
      down() {
        haveSpriteMoveDown(myUUId)
      },
      right() {
        haveSpriteMoveRight(myUUId)
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
      {entries(sprites).map(([uuid, { emoji, x, y, kind }]) => {
        const isCharacter = kind === 'player' || kind === 'npc'
        const isFlat = kind === 'warp'

        return (
          <div
            key={uuid}
            className="absolute top-0 left-0 flex items-center justify-center transition-transform duration-1250 ease-out-expo"
            style={{
              ...styleSpriteTile,
              transform: `translate(${100 * x}%,${100 * y}%)`,
              zIndex: isFlat ? 0 : y * 2 + (isCharacter ? 1 : 0),
            }}
          >
            <div className="flex items-center justify-center">
              {isCharacter && (
                <>
                  {kind === 'player' && <EmojiPlayer emoji={emoji as any} className="absolute w-full h-full" />}
                  {kind === 'npc' && <EmojiNPC emoji={emoji as any} className="absolute w-full h-full" />}
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
              {kind === 'item' && <EmojiMapItem emoji={emoji} className="absolute w-full h-full" />}
              {kind === 'chest' && (
                <EmojiMapItem emoji="📦" className="absolute w-full h-full" animation="animate-none" scale={0.75} />
              )}
              {kind === 'warp' && (
                <>
                  <EmojiStatic emoji={emoji} className="absolute w-full h-full" />
                  <Particles
                    id={`warp-${x}-${y}`}
                    options={{
                      fpsLimit: 120,
                      particles: {
                        color: {
                          value: '#ffffff',
                        },
                        move: {
                          direction: 'top',
                          enable: true,
                          outMode: 'out',
                          random: false,
                          speed: 2,
                          straight: false,
                          size: true,
                        },
                        number: {
                          density: {
                            enable: true,
                            area: 400,
                          },
                          value: 80,
                        },
                        opacity: {
                          value: 0.5,
                        },
                        shape: {
                          type: 'circle',
                        },
                        size: {
                          random: true,
                          value: 7,
                        },
                      },
                      detectRetina: true,
                    }}
                  />
                </>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )

  const styleTileRow: CSSProperties = {
    width: `${100 * tileWidth}%`,
    height: `${100 * tileHeight}%`,
  }

  const elTilesV2 = rawMap.map((row, y) => (
    <div key={`${y}`} className="flex" style={styleTileRow}>
      {row.map((cell, x) => {
        const isTile = cell !== '⬛️'
        const tr = isTile && getRawTile(rawMap, x + 1, y) === '⬛️' && getRawTile(rawMap, x, y - 1) === '⬛️'
        const br = isTile && getRawTile(rawMap, x + 1, y) === '⬛️' && getRawTile(rawMap, x, y + 1) === '⬛️'
        const bl = isTile && getRawTile(rawMap, x - 1, y) === '⬛️' && getRawTile(rawMap, x, y + 1) === '⬛️'
        const tl = isTile && getRawTile(rawMap, x - 1, y) === '⬛️' && getRawTile(rawMap, x, y - 1) === '⬛️'
        const isEven = (x % 2 === 0 && y % 2 === 0) || (x % 2 === 1 && y % 2 === 1)

        return (
          <div
            key={`${x}`}
            className={`relative flex items-center justify-center w-full h-full shrink-0 ${
              tr
                ? 'rounded-tr-[25%]'
                : br
                ? 'rounded-br-[25%]'
                : bl
                ? 'rounded-bl-[25%]'
                : tl
                ? 'rounded-tl-[25%]'
                : null
            } ${isTile ? (isEven ? 'bg-green-400' : 'bg-green-500') : 'bg-transparent'}`}
          >
            <div className="flex items-end justify-center">{/* TODO: add static tile things here */}</div>
          </div>
        )
      })}
    </div>
  ))

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
          >
            <div className="flex items-end justify-center">{/* TODO: add static tile things here */}</div>
          </div>
        )
      })}
    </div>
  ))

  // const elDebug = (
  //   <div className="fixed top-0 left-0 bg-red-500/30">
  //     <pre>{stringify({ sprites }, null, 2)}</pre>
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
            {elTilesV2}
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
