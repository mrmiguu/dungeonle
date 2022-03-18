import { cells, generateCellularAutomaton } from './cellularAutomaton'
import { Tuple } from './types'

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

function getRawMap<W extends number, H extends number>(width: W, height: H): Map<W, H> {
  return generateCellularAutomaton({ width, height, whiteLevel: 0.5, seed: `dungeonle-${1}` })
}

function getRawTile<W extends number, H extends number>(rawMap: Map<W, H>, x: number, y: number): Tile {
  return rawMap[y]?.[x] ?? '⬛️'
}

function drawMap<W extends number, H extends number>(map: Map<W, H>) {
  return map.map(pixelsRow => pixelsRow.join('')) as Tuple<string, H>
}

export { getRawMap, getRawTile, drawMap }
