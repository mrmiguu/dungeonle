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

function generateWhiteNoise({ size, whiteLevel = 0.5, seed }: generateWhiteNoiseProps): Cell[] {
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

function drawMatrix(terrain_matrix: Cell[][]): string[] {
  return terrain_matrix.map(pixelsRow => pixelsRow.join(''))
}

type generateCellularAutomatonProps = {
  width: number
  height: number
  whiteLevel?: number
  seed?: string
}

function generateCellularAutomaton({ width, height, whiteLevel = 0.5, seed }: generateCellularAutomatonProps) {
  let currentMatrix: Cell[][] = [...Array(height)].map(() => generateWhiteNoise({ size: width, whiteLevel, seed }))
  let lastMatrix: Cell[][] | undefined = undefined

  let count = 0
  const iterationsLimit = 100
  while (areMatricesDifferent(currentMatrix, lastMatrix) || count > iterationsLimit) {
    lastMatrix = currentMatrix
    currentMatrix = cellularAutomaton(lastMatrix)
  }

  return currentMatrix
}

export type { Black, White, Cell }
export { generateCellularAutomaton, generateWhiteNoise, drawMatrix }
