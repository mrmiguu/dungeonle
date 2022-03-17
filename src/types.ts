type Tail<T extends any[]> = T extends [head: any, ...tail: infer Tail_] ? Tail_ : never

// https://stackoverflow.com/a/52490977/4656851
type tupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N ? R : tupleOf<T, N, [T, ...R]>
type Tuple<T, N extends number> = N extends N ? (number extends N ? T[] : tupleOf<T, N, []>) : never

export type { Tail, Tuple }
