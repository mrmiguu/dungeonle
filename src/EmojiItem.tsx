import { CSSProperties, useMemo } from 'react'
import { Emoji } from './emojis'
import EmojiStatic from './EmojiStatic'
import { random } from './random'

type EmojiItemProps = { emoji: Emoji; className?: string; style?: CSSProperties }

function EmojiItem({ emoji, className, style }: EmojiItemProps) {
  const uniqueAnimationTimeOffset = useMemo(() => ~~(random(emoji) * 3000), [emoji])

  const el = (
    <EmojiStatic
      className={`animate-twist-fast ${className}`}
      style={{ animationDelay: `${-uniqueAnimationTimeOffset}ms`, ...(style ?? {}) }}
      emoji={emoji}
    />
  )

  return el
}

export default EmojiItem
