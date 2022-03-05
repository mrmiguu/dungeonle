import { Tail } from './types'

const { log, warn, error } = console
const { parse, stringify } = JSON
const { keys, values, entries } = Object
const { abs, min, max, sqrt, PI, pow } = Math

const sleep = (...args: Tail<Parameters<typeof setTimeout>>) => new Promise(resolve => setTimeout(resolve, ...args))

export { log, warn, error, parse, stringify, keys, values, entries, abs, min, max, sqrt, PI, pow, sleep }
