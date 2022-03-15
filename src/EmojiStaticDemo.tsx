import EmojiStatic from './EmojiStatic'

function EmojiStaticDemo() {
  return (
    <div className="fixed flex items-center justify-center w-full h-full">
      <div className="w-1/2 h-1/2 bg-blue-400/50">
        <EmojiStatic emoji="📦" className="h-full outline" />
      </div>
    </div>
  )
}

export default EmojiStaticDemo
