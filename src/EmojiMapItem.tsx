import { CSSProperties, useMemo } from 'react'
import { Emoji, MapItemOverride, MapItemOverrideProps, mapItemOverrides } from './emojis'
import EmojiStatic from './EmojiStatic'
import { random } from './random'

type EmojiItemProps = { emoji: Emoji; style?: CSSProperties } & Omit<MapItemOverrideProps, 'sound'>

function EmojiMapItem({ emoji, animation, scale, className, style }: EmojiItemProps) {
  const uniqueAnimationTimeOffset = useMemo(() => ~~(random(emoji) * 3000), [emoji])

  const override = mapItemOverrides[emoji as MapItemOverride]

  const el = (
    <div className={`${className ?? override?.className} ${animation ?? override?.animation ?? 'animate-float'}`}>
      <EmojiStatic
        style={{
          animationDelay: `${-uniqueAnimationTimeOffset}ms`,
          transform: `scale(${scale ?? override?.scale ?? 0.5})`,
          ...(style ?? {}),
        }}
        emoji={emoji}
      />
    </div>
  )

  return el
}

export default EmojiMapItem
