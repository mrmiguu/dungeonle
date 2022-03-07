import { CSSProperties } from 'react'

import { MouthKind } from './mouths'

function Mouth({ kind, className, style }: { kind: MouthKind; className?: string; style?: CSSProperties }) {
  return (
    <div className={className} style={style}>
      <div className="aspect-square w-full rotate-90">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 16 16"
          preserveAspectRatio="xMinYMid meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          <text x={`${50}%`} y={`${60}%`} dominantBaseline="middle" textAnchor="middle" fontSize={16} fill="black">
            {kind}
          </text>
        </svg>
      </div>
    </div>
  )
}

export default Mouth
