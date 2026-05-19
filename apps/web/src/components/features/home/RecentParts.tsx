// apps/web/src/components/features/home/RecentParts.tsx
import { Card, Skeleton } from '@auto-bazaar-pro/ui/components';

export function RecentParts() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <Skeleton className="h-24 w-full rounded-lg mb-3" />
          <Skeleton variant="text" className="w-2/3" />
        </Card>
      ))}
    </div>
  );
}
