// https://yonatankra.com/how-to-generate-a-maze-using-javascript-and-html5-canvas-and-a-cellular-automaton-algorithm/
// https://codepen.io/yonatankra/pen/qBmxRNr

import { random } from './random'
import { Tuple } from './types'
import { parse, stringify } from './utils'

type Row<N extends number> = Tuple<Cell, N>
type Matrix<W extends number, H extends number> = Tuple<Row<W>, H>

const cells = {
  empty: '⬜️',
  blocked: '⬛️',
} as const

type Cell = typeof cells[keyof typeof cells]

type generateWhiteNoiseProps<N extends number> = {
  size: N
  whiteLevel?: number
  seed?: string
}

function generateWhiteNoise<N extends number>({ size, whiteLevel = 0.5, seed }: generateWhiteNoiseProps<N>): Row<N> {
  return [...Array(size)].map(() => (random(seed) >= whiteLevel ? '⬛️' : '⬜️')) as Row<N>
}

function calculatePixelValueByNeighbors<W extends number, H extends number>(
  rowIndex: number,
  pixelIndex: number,
  matrix: Matrix<W, H>,
): Cell {
  let sum = 0
  for (let y = -1; y < 2; y++) {
    for (let x = -1; x < 2; x++) {
      if (matrix[rowIndex + y]?.[pixelIndex + x] !== '⬜️') {
        sum -= 1
      } else {
        sum += 1
      }
    }
  }
  return sum > 0 ? '⬜️' : '⬛️'
}

function copyMatrix<W extends number, H extends number>(matrix: Matrix<W, H>): Matrix<W, H> {
  return parse(stringify(matrix))
}

function cellularAutomaton<W extends number, H extends number>(matrix: Matrix<W, H>): Matrix<W, H> {
  const draftMatrix = copyMatrix(matrix)
  draftMatrix.forEach((row, rowIndex) => {
    row.forEach((_, pixelIndex) => {
      row[pixelIndex]! = calculatePixelValueByNeighbors(rowIndex, pixelIndex, matrix)
    })
  })
  return draftMatrix
}

function areMatricesDifferent<W extends number, H extends number>(
  matrixA: Matrix<W, H> | undefined,
  matrixB: Matrix<W, H> | undefined,
) {
  return stringify(matrixA) !== stringify(matrixB)
}

function drawMatrix<W extends number, H extends number>(terrain_matrix: Matrix<W, H>) {
  return terrain_matrix.map(pixelsRow => pixelsRow.join('')) as Tuple<string, H>
}

type generateCellularAutomatonProps<W extends number, H extends number> = {
  width: W
  height: H
  whiteLevel?: number
  seed?: string
}

function generateCellularAutomaton<W extends number, H extends number>({
  width,
  height,
  whiteLevel = 0.5,
  seed,
}: generateCellularAutomatonProps<W, H>): Matrix<W, H> {
  let currentMatrix = [...Array(height)].map(() => generateWhiteNoise({ size: width, whiteLevel, seed })) as Matrix<
    W,
    H
  >
  let lastMatrix: Matrix<W, H> | undefined = undefined

  let count = 0
  const iterationsLimit = 100
  while (areMatricesDifferent(currentMatrix, lastMatrix) || count > iterationsLimit) {
    lastMatrix = currentMatrix
    currentMatrix = cellularAutomaton(lastMatrix)
  }

  return currentMatrix
}

export type { Cell, Row, Matrix }
export { cells, generateCellularAutomaton, generateWhiteNoise, drawMatrix }
