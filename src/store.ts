import produce from 'immer'
import { useEffect } from 'react'
import create from 'zustand'
import { Emoji } from './emojis'

type Sprite = { emoji: Emoji; x: number; y: number; kind: 'monster' | 'item' | 'chest' }
type SpriteMap = { [uuid: string]: Sprite }

type SpriteStore = {
  sprites: SpriteMap
  sprite: (uuid: string) => Sprite | undefined
  populate: (sprites: SpriteMap) => void
  moveUp: (uuid: string) => void
  moveLeft: (uuid: string) => void
  moveDown: (uuid: string) => void
  moveRight: (uuid: string) => void
}

const useSpriteStore = create<SpriteStore>((set, get) => ({
  sprites: {},
  sprite(uuid: string) {
    return get().sprites[uuid]
  },
  populate(sprites: SpriteMap) {
    set({ sprites })
  },
  moveUp(uuid: string) {
    set(
      produce<SpriteStore>(store => {
        store.sprites[uuid]!.y--
      }),
    )
  },
  moveLeft(uuid: string) {
    set(
      produce<SpriteStore>(store => {
        store.sprites[uuid]!.x--
      }),
    )
  },
  moveDown(uuid: string) {
    set(
      produce<SpriteStore>(store => {
        store.sprites[uuid]!.y++
      }),
    )
  },
  moveRight(uuid: string) {
    set(
      produce<SpriteStore>(store => {
        store.sprites[uuid]!.x++
      }),
    )
  },
}))

const useSpriteStoreSprites = () => useSpriteStore(store => store.sprites)
const useSpriteStoreSprite = (uuid: string) => useSpriteStore(store => store.sprite)(uuid)

const useSpriteStorePopulate = (sprites: SpriteMap) => {
  const populate = useSpriteStore(store => store.populate)

  useEffect(() => {
    populate(sprites)
  }, [sprites])
}

const useSpriteStoreMoveUp = () => useSpriteStore(store => store.moveUp)
const useSpriteStoreMoveLeft = () => useSpriteStore(store => store.moveLeft)
const useSpriteStoreMoveDown = () => useSpriteStore(store => store.moveDown)
const useSpriteStoreMoveRight = () => useSpriteStore(store => store.moveRight)

const useSpriteStoreAll = () => useSpriteStore(store => store)

export type { Sprite, SpriteMap }
export {
  useSpriteStoreSprites,
  useSpriteStoreSprite,
  useSpriteStorePopulate,
  useSpriteStoreMoveUp,
  useSpriteStoreMoveLeft,
  useSpriteStoreMoveDown,
  useSpriteStoreMoveRight,
  useSpriteStoreAll,
}
