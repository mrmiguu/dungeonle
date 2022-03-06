import { CSSProperties } from 'react'

function BlackBeadyEye({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <div className={className} style={style}>
      <div className="aspect-square w-full h-full rounded-full shrink-0 bg-black">
        <div className="w-full h-full rounded-full flex justify-center items-start -rotate-45">
          <div className="w-1/4 h-1/4 rounded-full bg-white" style={{ marginTop: `15%` }} />
        </div>
      </div>
    </div>
  )
}

export default BlackBeadyEye
