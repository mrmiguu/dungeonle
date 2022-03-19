import GraphemeSplitter from 'grapheme-splitter'
import { cells, generateCellularAutomaton } from './cellularAutomaton'
import { Tuple } from './types'

const splitter = new GraphemeSplitter()

const tiles = {
  ...cells,
  chest: '🟫',
  boss: '🟥',
  miniboss: '🟧',
  coin: '🟨',
  monster: '🟩',
  warp: '🟦',
  player: '🟪',
} as const

type Tile = typeof tiles[keyof typeof tiles]
type Map<W extends number, H extends number> = Tuple<Tuple<Tile, W>, H>
type TileRow<N extends number> = Tuple<Tile, N>
type JSONMap<H extends number> = Tuple<string, H>

function findTiles<W extends number, H extends number>(tile: Tile, map: Map<W, H>): [number, number][] {
  return map.reduce<[number, number][]>((pool, row, y) => {
    const x = row.indexOf(tile)
    if (x !== -1) pool.push([x, y])
    return pool
  }, [])
}

function getRawMap<W extends number, H extends number>(width: W, height: H): Map<W, H> {
  return undrawMap([
    '⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️',
    '⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️',
    '⬛️⬛️⬛️⬛️🟫⬜️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬜️⬜️⬜️⬛️⬛️⬛️',
    '⬛️⬛️⬛️⬜️⬜️⬜️⬜️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬜️⬜️⬜️🟫⬜️⬛️⬛️',
    '⬛️⬛️⬛️⬜️⬜️🟥⬜️⬜️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬜️⬜️🟧⬜️⬜️⬜️⬛️⬛️',
    '⬛️⬛️⬛️⬛️⬜️⬜️⬜️⬜️⬜️⬛️⬛️⬛️⬛️⬛️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬛️⬛️⬛️',
    '⬛️⬛️⬛️⬛️⬛️⬜️⬜️⬜️🟦⬛️⬛️⬛️⬛️🟦⬜️⬜️⬜️⬜️⬛️⬛️⬛️⬛️⬛️⬛️',
    '⬛️⬛️⬛️⬛️⬛️⬛️⬜️⬜️⬛️⬛️⬛️⬛️⬛️⬜️⬜️⬜️⬜️⬛️⬛️⬛️⬛️⬛️⬛️⬛️',
    '⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬜️🟦⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️',
    '⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️',
    '⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️🟦⬜️⬜️⬜️⬛️⬛️⬛️',
    '⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬜️⬜️⬜️⬜️🟩⬜️⬛️⬛️',
    '⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬛️⬛️',
    '⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬜️🟨⬜️⬜️⬜️⬜️⬜️⬜️⬛️⬛️',
    '⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬜️⬜️⬛️⬛️⬛️⬛️⬜️⬜️⬜️⬜️⬜️⬜️🟨⬜️⬜️⬛️⬛️',
    '⬛️⬛️⬛️⬛️⬛️⬛️⬜️⬜️🟨⬜️⬛️⬛️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬛️⬛️',
    '⬛️⬛️⬛️⬛️⬛️⬛️⬜️⬜️⬜️⬜️⬜️⬜️🟩🟨⬜️⬜️⬜️⬜️🟩⬜️⬜️⬜️⬛️⬛️',
    '⬛️⬛️⬛️⬛️⬛️⬛️⬜️⬜️🟨⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬛️⬛️⬛️',
    '⬛️⬛️⬛️⬛️⬛️⬜️⬜️⬜️⬜️⬜️🟩⬜️⬜️⬜️🟩⬜️⬜️⬛️⬛️⬛️⬛️⬛️⬛️⬛️',
    '⬛️⬛️⬛️⬛️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️🟨⬜️⬜️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️',
    '⬛️⬛️⬛️⬜️🟩⬜️⬜️⬜️🟨⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️',
    '⬛️⬛️⬛️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️',
    '⬛️⬛️⬛️⬛️⬜️🟪⬜️⬜️⬜️⬛️⬛️⬛️⬛️⬜️⬜️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️',
    '⬛️⬛️⬛️⬛️⬛️🟦⬜️⬜️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️⬛️',
  ] as JSONMap<H>)
  return generateCellularAutomaton({ width, height, whiteLevel: 0.5, seed: `dungeonle-${1}` })
}

function getRawTile<W extends number, H extends number>(rawMap: Map<W, H>, x: number, y: number): Tile {
  return rawMap[y]?.[x] ?? '⬛️'
}

function drawMap<W extends number, H extends number>(map: Map<W, H>) {
  return map.map(pixelsRow => pixelsRow.join('')) as JSONMap<H>
}

function undrawMap<W extends number, H extends number>(json: JSONMap<H>): Map<W, H> {
  return json.map(row => splitter.splitGraphemes(row) as TileRow<W>) as Map<W, H>
}

export type { Tile, Map, TileRow, JSONMap }
export { findTiles, getRawMap, getRawTile, drawMap, undrawMap, tiles }
