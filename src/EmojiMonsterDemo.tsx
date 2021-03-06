import EmojiNPC from './EmojiNPC'

function EmojiNPCDemo() {
  return (
    <div className="fixed flex items-center justify-center w-full h-full">
      <div className="w-1/2 h-1/2 bg-blue-400/50">
        <EmojiNPC emoji="🌰" className="w-full h-full" />
      </div>
    </div>
  )
}

export default EmojiNPCDemo
