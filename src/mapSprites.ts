import { v4 as uuid4 } from 'uuid'
import { findTiles, Map, Tile } from './maps'
import { Sprite, SpriteMap } from './store'

type SpriteNoPosition = Omit<Sprite & { uuid?: string }, 'x' | 'y'>

function mapSpritesToTiles<W extends number, H extends number>(
  map: Map<W, H>,
  tile: Tile,
  on: (args: { x: number; y: number; i: number; n: number }) => SpriteNoPosition,
) {
  const tileCoords = findTiles(tile, map)
  return tileCoords.reduce<SpriteMap>((pool, [x, y], i) => {
    const { uuid, ...sprite } = on({ x, y, i, n: tileCoords.length })
    return { ...pool, [uuid ?? uuid4()]: { x, y, ...sprite } } as SpriteMap
  }, {})
}

export { mapSpritesToTiles }
