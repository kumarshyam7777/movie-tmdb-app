interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-surface-600 rounded-lg ${className}`}
      style={{
        background: 'linear-gradient(90deg, #22222f 25%, #2d2d3e 50%, #22222f 75%)',
        backgroundSize: '1000px 100%',
        animation: 'shimmer 2s infinite linear',
      }}
    />
  );
}

export function MovieCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="aspect-[2/3] w-full rounded-xl" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative w-full h-[85vh]">
      <Skeleton className="absolute inset-0 rounded-none" />
      <div className="absolute bottom-16 left-16 flex flex-col gap-4">
        <Skeleton className="h-12 w-96" />
        <Skeleton className="h-6 w-72" />
        <Skeleton className="h-5 w-48" />
        <div className="flex gap-3 mt-4">
          <Skeleton className="h-12 w-36 rounded-full" />
          <Skeleton className="h-12 w-36 rounded-full" />
        </div>
      </div>
    </div>
  );
}
