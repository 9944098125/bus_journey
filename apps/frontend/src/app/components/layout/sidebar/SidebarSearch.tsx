import React, { useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from 'app/components/ui/tooltip';
import { cn } from 'utils/twm';

type SidebarSearchProps = {
  collapsed: boolean;
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
};

export default function SidebarSearch({
  collapsed,
  value,
  onChange,
  onClear,
}: SidebarSearchProps) {
  const inputId = useId();

  if (collapsed) {
    return (
      <div className="flex justify-center px-2 pb-2">
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                'flex size-10 items-center justify-center rounded-2xl',
                'bg-white/8 text-white/50 ring-1 ring-white/12 transition-colors',
                'hover:bg-white/12 hover:text-white/85',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/70',
              )}
              aria-label="Search navigation (expand sidebar to search)"
            >
              <Search size={18} strokeWidth={2} aria-hidden />
            </motion.button>
          </TooltipTrigger>
          <TooltipContent side="right">Expand sidebar to search</TooltipContent>
        </Tooltip>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="px-3 pb-3"
      >
        <label htmlFor={inputId} className="sr-only">
          Search navigation
        </label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/35"
            aria-hidden
          />
          <input
            id={inputId}
            type="search"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="Search trips, bookings..."
            className={cn(
              'h-10 w-full rounded-2xl border border-white/12 bg-white/[0.07] pl-10 pr-9 text-[13px] text-white',
              'placeholder:text-white/35 backdrop-blur-sm transition-all duration-300',
              'hover:border-white/20 hover:bg-white/[0.1]',
              'focus:border-sky-300/45 focus:bg-white/[0.11] focus:outline-none focus:ring-2 focus:ring-sky-300/25',
            )}
            autoComplete="off"
            spellCheck={false}
          />
          {value.length > 0 && (
            <button
              type="button"
              onClick={onClear}
              className={cn(
                'absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-xl',
                'text-white/45 transition-colors hover:bg-white/10 hover:text-white/85',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/60',
              )}
              aria-label="Clear search"
            >
              <X size={14} aria-hidden />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
