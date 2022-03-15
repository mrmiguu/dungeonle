import { CSSProperties, useMemo } from 'react'
import { Emoji, MapItemOverride, mapItemOverrides } from './emojis'
import EmojiStatic from './EmojiStatic'
import { random } from './random'

type EmojiItemProps = { emoji: Emoji; className?: string; style?: CSSProperties }

function EmojiMapItem({ emoji, className, style }: EmojiItemProps) {
  const uniqueAnimationTimeOffset = useMemo(() => ~~(random(emoji) * 3000), [emoji])

  const override = mapItemOverrides[emoji as MapItemOverride]

  const el = (
    <div className={`${className ?? override?.className} ${override?.animation ?? 'animate-float'}`}>
      <EmojiStatic
        style={{
          animationDelay: `${-uniqueAnimationTimeOffset}ms`,
          transform: `scale(${override?.scale ?? 0.5})`,
          ...(style ?? {}),
        }}
        emoji={emoji}
      />
    </div>
  )

  return el
}

export default EmojiMapItem
