import { cn } from 'utils/twm';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-2xl bg-white/12',
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
