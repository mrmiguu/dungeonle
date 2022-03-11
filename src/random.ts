import seedrandom, { PRNG } from 'seedrandom'

function random(seed?: string) {
  if (!random_cache.has(seed)) {
    random_cache.set(seed, seedrandom(seed))
  }
  return random_cache.get(seed)!()
}
const random_cache = new Map<string | undefined, PRNG>()

export { random }
