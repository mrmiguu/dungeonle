import { v4 as uuid4 } from 'uuid'
import { findTiles, Map, Tile } from './maps'
import { Sprite, SpriteMap } from './store'

type SpriteNoPosition = Omit<Sprite & { uuid?: string }, 'x' | 'y'>

function mapSpritesToTiles<W extends number, H extends number>(
  map: Map<W, H>,
  tile: Tile,
  on: (x: number, y: number, i: number) => SpriteNoPosition,
) {
  return findTiles(tile, map).reduce<SpriteMap>((pool, [x, y], i) => {
    const { uuid, ...sprite } = on(x, y, i)
    return { ...pool, [uuid ?? uuid4()]: { x, y, ...sprite } } as SpriteMap
  }, {})
}

export { mapSpritesToTiles }
