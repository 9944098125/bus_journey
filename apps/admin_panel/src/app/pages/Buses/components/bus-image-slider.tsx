import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';

import { cn } from 'utils/twm';

export interface BusImageSliderProps {
  images: string[];
  busName: string;
  isActive?: boolean;
  heightClass?: string;
  autoPlay?: boolean;
  autoPlayIntervalMs?: number;
  onImageClick?: () => void;
}

export function BusImageSlider({
  images,
  busName,
  isActive,
  heightClass = 'h-48',
  autoPlay = false,
  autoPlayIntervalMs = 3000,
  onImageClick,
}: BusImageSliderProps) {
  const [index, setIndex] = useState(0);
  const safeIndex = images.length ? index % images.length : 0;

  useEffect(() => {
    if (!autoPlay || images.length <= 1) return;
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % images.length);
    }, autoPlayIntervalMs);
    return () => clearInterval(timer);
  }, [autoPlay, autoPlayIntervalMs, images.length, index]);

  const go = (e: React.MouseEvent, dir: number) => {
    e.stopPropagation();
    setIndex(prev => (prev + dir + images.length) % images.length);
  };

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden bg-slate-100',
        heightClass,
      )}
    >
      {isActive !== undefined && (
        <span
          className={cn(
            'absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm ring-1',
            isActive
              ? 'bg-emerald-500/90 text-white ring-emerald-300'
              : 'bg-slate-500/90 text-white ring-slate-300',
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
          {isActive ? 'Active' : 'Inactive'}
        </span>
      )}

      {images.length > 0 ? (
        <>
          <img
            src={images[safeIndex]}
            alt={`${busName} photo ${safeIndex + 1}`}
            className="h-full w-full cursor-pointer object-cover transition-transform duration-300 hover:scale-[1.03]"
            onClick={onImageClick}
          />
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={e => go(e, -1)}
                className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur-sm transition-all hover:bg-black/60 group-hover:opacity-100"
                aria-label="Previous photo"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={e => go(e, 1)}
                className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur-sm transition-all hover:bg-black/60 group-hover:opacity-100"
                aria-label="Next photo"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      setIndex(i);
                    }}
                    className={cn(
                      'h-1.5 rounded-full transition-all',
                      i === safeIndex
                        ? 'w-5 bg-white'
                        : 'w-1.5 bg-white/60 hover:bg-white/80',
                    )}
                    aria-label={`Go to photo ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-400">
          <ImageOff className="h-8 w-8" />
          <span className="text-sm font-medium">No photos</span>
        </div>
      )}
    </div>
  );
}
