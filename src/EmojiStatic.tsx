import { CSSProperties } from 'react'
import useAsync from 'react-use/lib/useAsync'
import { Emoji, openmoji_svg_color } from './emojis'
import { keys, log, stringify, unicode } from './utils'

type EmojiStaticProps = { emoji: Emoji; className?: string; style?: CSSProperties }

function EmojiStatic({ emoji, className, style }: EmojiStaticProps) {
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

  const el = (
    <div className={className} style={style}>
      <div className="relative w-full h-full origin-bottom">
        {emojiSVG && <img className="w-full h-full" src={emojiSVG} alt="emoji" />}
      </div>
    </div>
  )

  return el
}

export default EmojiStatic
