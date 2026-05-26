import { cn } from 'utils/twm';

type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  shimmer?: boolean;
};

function Skeleton({
  className,
  shimmer = true,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-md bg-sea-pale/50',
        className,
      )}
      {...props}
    >
      {shimmer && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 animate-skeleton-shimmer bg-gradient-to-r from-transparent via-white/80 to-transparent"
        />
      )}
    </div>
  );
}

export { Skeleton };
