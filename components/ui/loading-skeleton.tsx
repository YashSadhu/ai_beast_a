import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200", className)}
      {...props}
    />
  )
}

export function ChatSkeleton() {
  return (
    <div className="space-y-4">
      {/* User message skeleton */}
      <div className="flex justify-end">
        <div className="bg-gray-200 rounded-2xl px-4 py-3 max-w-[80%] animate-pulse">
          <Skeleton className="h-4 w-48" />
        </div>
      </div>

      {/* AI responses skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <Skeleton className="w-6 h-6 rounded" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ModelCardSkeleton() {
  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 animate-pulse">
      <div className="flex items-center gap-2 mb-3">
        <Skeleton className="w-6 h-6 rounded" />
        <div className="space-y-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  )
}