import { useMemo } from 'react'
import useAsync from 'react-use/lib/useAsync'
import BlackBeadyEye from './BlackBeadyEye'
import { Emoji, FaceOverride, faceOverrides, openmoji_svg_color } from './emojis'
import Mouth from './Mouth'
import { mouths } from './mouths'
import { random } from './random'
import { abs, keys, log, stringify, unicode } from './utils'

type EmojiMonsterProps = { emoji: Emoji; className?: string }

function EmojiMonster({ emoji, className }: EmojiMonsterProps) {
  const uniqueAnimationTimeOffset = useMemo(() => ~~(random(emoji) * 3000), [emoji])

  const faceOffset = faceOverrides[emoji as FaceOverride]

  const mouth = useMemo(() => {
    const { length } = mouths
    return faceOffset.mouth ?? mouths[~~abs(random(emoji) * length) % length]!
  }, [emoji])

  const pendingEmojiSVG = useAsync(async () => {
    const emojiUnicode = unicode(emoji)

    if (!emojiUnicode.length) throw new Error('Failed to convert emoji to unicode')

    const svgUnicodePaths = keys(openmoji_svg_color)

    let unicodeBuffer = emojiUnicode[0]
    let lastValidUnicodePath: string | undefined = undefined
    for (const unicode of emojiUnicode.slice(1)) {
      for (const path of svgUnicodePaths) {
        if (path.endsWith(`/${unicodeBuffer}.svg`)) lastValidUnicodePath = path
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
    <div className="flex flex-col items-center justify-center w-full">
      {elFaceEyes}
      <Mouth kind={mouth} style={{ width: `${7}%` }} />
    </div>
  )

  const el = (
    <div className={`${className}`}>
      <div
        className="relative w-full h-full origin-bottom animate-breathe"
        style={{ animationDelay: `${-uniqueAnimationTimeOffset}ms` }}
      >
        {emojiSVG && <img className="w-full h-full" src={emojiSVG} alt="monster emoji" />}

        <div
          className="absolute top-0 left-0 flex items-center justify-center w-full h-full"
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

  return el
}

export default EmojiMonster
