// Skeleton loading components — professional loading UX
// Usage: <Skeleton className="h-4 w-24" /> or <SkeletonCard />

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="card rounded-2xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <Skeleton className="h-2 w-full" />
      <Skeleton className="h-2 w-3/4" />
      <div className="grid grid-cols-3 gap-2 pt-1">
        <Skeleton className="h-12 rounded-lg" />
        <Skeleton className="h-12 rounded-lg" />
        <Skeleton className="h-12 rounded-lg" />
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-2 py-2">
      <Skeleton className="h-6 w-6 rounded" />
      <Skeleton className="h-3 w-16" />
      <Skeleton className="h-2 flex-1" />
      <Skeleton className="h-3 w-10" />
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-10" />
          </div>
          <Skeleton className="h-1 w-full" />
          <Skeleton className="h-6 rounded-lg" />
        </div>
      ))}
    </div>
  );
}
