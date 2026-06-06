function LoadingSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="h-14 animate-pulse rounded-lg border border-[#E8E4DC] bg-white" />
      ))}
    </div>
  )
}

export default LoadingSkeleton
