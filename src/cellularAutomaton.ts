// https://yonatankra.com/how-to-generate-a-maze-using-javascript-and-html5-canvas-and-a-cellular-automaton-algorithm/
// https://codepen.io/yonatankra/pen/qBmxRNr

import { random } from './random'
import { parse, stringify } from './utils'

type Black = '⬛️'
type White = '⬜️'
type Cell = Black | White

type generateWhiteNoiseProps = {
  size: number
  whiteLevel?: number
  seed?: string
}

function generateWhiteNoise({ size, whiteLevel = 0.6, seed }: generateWhiteNoiseProps): Cell[] {
  return [...Array(size)].map(() => (random(seed) >= whiteLevel ? '⬛️' : '⬜️'))
}

function calculatePixelValueByNeighbors(rowIndex: number, pixelIndex: number, matrix: Cell[][]): Cell {
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

function copyMatrix(matrix: Cell[][]): Cell[][] {
  return parse(stringify(matrix))
}

function cellularAutomaton(matrix: Cell[][]) {
  const draftMatrix = copyMatrix(matrix)
  draftMatrix.forEach((row, rowIndex) => {
    row.forEach((_, pixelIndex) => {
      row[pixelIndex]! = calculatePixelValueByNeighbors(rowIndex, pixelIndex, matrix)
    })
  })
  return draftMatrix
}

function areMatricesDifferent(matrixA: Cell[][] | undefined, matrixB: Cell[][] | undefined) {
  return stringify(matrixA) !== stringify(matrixB)
}

function draw(terrain_matrix: Cell[][]): string[] {
  return terrain_matrix.map(pixelsRow => pixelsRow.join(''))
}

function generateCellularAutomaton(seed?: string) {
  const CANVAS_HEIGHT = 400
  const CANVAS_WIDTH = 400

  const PIXEL_RATIO = 10
  const MATRIX_DIMENSIONS = {
    height: CANVAS_HEIGHT / PIXEL_RATIO,
    width: CANVAS_WIDTH / PIXEL_RATIO,
  } as const

  const matrices = {
    last: undefined as Cell[][] | undefined,
    current: [] as Cell[][],
  }

  matrices.current = [...Array(MATRIX_DIMENSIONS.height)].map(() => {
    return generateWhiteNoise({ size: MATRIX_DIMENSIONS.width, whiteLevel: 0.5, seed })
  })

  let count = 0
  const ITERATIONS_LIMIT = 100
  while (areMatricesDifferent(matrices.current, matrices.last) || count > ITERATIONS_LIMIT) {
    matrices.last = matrices.current
    matrices.current = cellularAutomaton(matrices.last)
  }

  return draw(matrices.current)
}

export { generateCellularAutomaton, generateWhiteNoise }
