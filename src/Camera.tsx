import { CSSProperties, ReactNode } from 'react'

type CameraProps = {
  x: number
  y: number
  tileWidth: number
  tileHeight: number
  mapWidth: number
  mapHeight: number
  className?: string
  style?: CSSProperties
  children: ReactNode
}

function Camera({ x, y, tileWidth, tileHeight, mapWidth, mapHeight, className, style, children }: CameraProps) {
  const styleWorld: CSSProperties = {
    transform: `translate(${-100 * tileWidth * x}%,${-100 * tileHeight * y}%)`,
    width: `${100 * mapWidth}%`,
    height: `${100 * mapHeight}%`,
  }

  const elWorld = (
    <div className="absolute transition-transform duration-2000 ease-out-expo" style={styleWorld}>
      {children}
    </div>
  )

  return (
    <div className={`relative aspect-square portrait:w-1/2 landscape:h-1/2 outline ${className}`} style={style}>
      {elWorld}
    </div>
  )
}

export default Camera
