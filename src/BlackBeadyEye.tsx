function BlackBeadyEye({ className }: { className?: string }) {
  return (
    <div className={`aspect-square rounded-full shrink-0 bg-black ${className}`}>
      <div className="relative w-full h-full">
        <div className="absolute w-full h-full rounded-full flex justify-center items-start -rotate-45">
          <div className="w-1/4 h-1/4 rounded-full bg-white" style={{ marginTop: `15%` }} />
        </div>
      </div>
    </div>
  )
}

export default BlackBeadyEye
