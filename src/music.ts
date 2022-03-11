import { Howl } from 'howler'
import { useEffect } from 'react'

const music_imports = import.meta.glob('./music/*.mp3')

async function music(file: string) {
  if (!music_cache.has(file)) {
    let src: string | undefined

    for (const path in music_imports) {
      if (path.endsWith(file)) {
        src = (await music_imports[path]!()).default
        break
      }
    }

    if (!src) throw new Error(`Failed to find music for "${file}"; not found`)

    music_cache.set(file, new Howl({ src }))
  }

  return music_cache.get(file)!
}
const music_cache = new Map<string, Howl>()

async function playMusic(file: string, loop?: boolean) {
  const howl = await music(file)
  howl.loop(loop ?? false)
  howl.play()
}

async function stopMusic(file: string) {
  ;(await music(file)).stop()
}

function useMusic(file?: string, loop?: boolean) {
  useEffect(() => {
    if (!file) return

    playMusic(file, loop)

    return () => {
      stopMusic(file)
    }
  }, [file, loop])
}

export { music_imports, music, playMusic, useMusic }
