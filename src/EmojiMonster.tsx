import { useMemo } from 'react'
import useAsync from 'react-use/lib/useAsync'
import seedrandom from 'seedrandom'

import BlackBeadyEye from './BlackBeadyEye'
import { faceOverrides, FaceOverride, openmoji_svg_color } from './emojis'
import { abs, keys, log, sleep, stringify, unicode } from './utils'
import Mouth from './Mouth'
import { mouths } from './mouths'

function EmojiMonster({ emoji, className }: { emoji: string; className?: string }) {
  const pendingAnimationDelay = useAsync(async () => {
    const random = seedrandom(emoji)
    await sleep(~~(random() * 3000))
  }, [emoji])

  const faceOffset = faceOverrides[emoji as FaceOverride]

  const mouth = useMemo(() => {
    const { length } = mouths
    const random = seedrandom(emoji)
    return faceOffset.mouth ?? mouths[~~abs(random() * length) % length]!
  }, [emoji])

  const pendingEmojiSVG = useAsync(async () => {
    const emojiUnicode = unicode(emoji)

    if (!emojiUnicode.length) throw new Error('Failed to convert emoji to unicode')

    const svgUnicodePaths = keys(openmoji_svg_color)

    let unicodeBuffer = emojiUnicode[0]
    let lastValidUnicodePath: string | undefined = undefined
    for (const unicode of emojiUnicode.slice(1)) {
      for (const path of svgUnicodePaths) {
        if (path.endsWith(`${unicodeBuffer}.svg`)) lastValidUnicodePath = path
      }
      unicodeBuffer += `-${unicode}`
    }

    if (!lastValidUnicodePath) throw new Error('Failed to map emoji to any valid SVG')

    const lastValidUnicodeSVG: string = (await openmoji_svg_color[lastValidUnicodePath]!())['default']!
    log(stringify({ lastValidUnicodeSVG }))
    return lastValidUnicodeSVG
  }, [emoji])

  const emojiSVG = pendingEmojiSVG.value

  const elFaceNose = <div style={{ width: `${100 / 6 + (faceOffset.eyeDistance ?? 0)}%` }} />
  const elFaceEyes = (
    <div className="flex justify-center w-full">
      <BlackBeadyEye style={{ width: `${4}%` }} />
      {elFaceNose}
      <BlackBeadyEye style={{ width: `${4}%` }} />
    </div>
  )

  const elFace = (
    <div className="flex flex-col w-full justify-center items-center">
      {elFaceEyes}
      <Mouth kind={mouth} style={{ width: `${7}%` }} />
    </div>
  )

  return (
    <div className={`${className}`}>
      <div className={`relative w-full h-full origin-bottom ${!pendingAnimationDelay.loading && 'animate-breathe'}`}>
        {emojiSVG && <img className="w-full h-full" src={emojiSVG} alt="monster emoji" />}

        <div
          className="absolute left-0 top-0 w-full h-full flex justify-center items-center"
          style={{
            marginLeft: `${faceOffset.x}%`,
            marginTop: `${faceOffset.y}%`,
          }}
        >
          {elFace}
        </div>
      </div>
    </div>
  )
}

export default EmojiMonster
