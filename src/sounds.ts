import { Howl } from 'howler'
import { useEffect } from 'react'

const sound_imports = import.meta.glob('./sounds/*.wav')

async function sound(file: string) {
  if (!sound_cache.has(file)) {
    let src: string | undefined

    for (const path in sound_imports) {
      if (path.endsWith(file)) {
        src = (await sound_imports[path]!()).default
        break
      }
    }

    if (!src) throw new Error(`Failed to find sound for "${file}"; not found`)

    sound_cache.set(file, new Howl({ src }))
  }

  return sound_cache.get(file)!
}
const sound_cache = new Map<string, Howl>()

async function playSound(file: string) {
  ;(await sound(file)).play()
}

async function stopSound(file: string) {
  ;(await sound(file)).stop()
}

function useSound(file?: string) {
  useEffect(() => {
    if (!file) return

    playSound(file)

    return () => {
      stopSound(file)
    }
  }, [file])
}

export { sound_imports, sound, playSound, useSound }
