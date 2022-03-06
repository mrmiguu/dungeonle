import toast from 'react-hot-toast'
import useAsync from 'react-use/lib/useAsync'

import BlackBeadyEye from './BlackBeadyEye'
import { faceOffsets, openmoji_svg_color } from './emojis'
import { keys, log, stringify, unicode } from './utils'
import WhiskerMouth from './WhiskerMouth'

function EmojiMonster({ emoji, className }: { emoji: string; className?: string }) {
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

  const elFace = (
    <div className="flex flex-col justify-center items-center">
      <div className="flex gap-8">
        <BlackBeadyEye className="w-3 h-3" />
        <BlackBeadyEye className="w-3 h-3" />
      </div>
      <WhiskerMouth className="text-xs" />
    </div>
  )

  const faceOffset = faceOffsets[emoji as keyof typeof faceOffsets]

  return (
    <div className={`${className}`}>
      <div className="relative w-full h-full">
        {emojiSVG && <img className="w-full h-full" src={emojiSVG} alt="monster emoji" />}

        <div className="absolute left-0 top-0 w-full h-full flex justify-center items-center" style={faceOffset.style}>
          {elFace}
        </div>
      </div>
    </div>
  )
}

export default EmojiMonster
