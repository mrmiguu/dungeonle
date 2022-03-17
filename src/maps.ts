import { Cell, generateCellularAutomaton } from './cellularAutomaton'
import { Tuple } from './types'

type Map<W extends number, H extends number> = Tuple<Tuple<Cell, W>, H>

function getRawMap<W extends number, H extends number>(width: W, height: H): Map<W, H> {
  return generateCellularAutomaton({ width, height, whiteLevel: 0.5, seed: `dungeonle-${1}` }) as any
}

function getRawTile<W extends number, H extends number>(rawMap: Map<W, H>, x: number, y: number): Cell {
  return rawMap[y]?.[x] ?? '⬛️'
}

export { getRawMap, getRawTile }
