import React, { useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Command } from 'lucide-react';

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
      <div className="flex justify-center px-2 pb-2 pt-3">
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <motion.button
              type="button"
              whileHover={{ scale: 1.06, y: -1 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                'flex size-12 items-center justify-center rounded-2xl',
                'bg-gradient-to-br from-white/90 to-plum-100/85 text-plum-700/55',
                'ring-1 ring-plum-600/12 shadow-sm transition-colors',
                'hover:text-plum-900 hover:ring-plum-500/35',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-plum-500/45',
              )}
              aria-label="Search navigation (expand sidebar to search)"
            >
              <Search size={18} strokeWidth={2} aria-hidden />
            </motion.button>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            className="border-plum-700/15 bg-plum-900 font-medium text-white"
          >
            Expand sidebar to search
          </TooltipContent>
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
        className="px-3 pb-2 pt-3"
      >
        <label htmlFor={inputId} className="sr-only">
          Search navigation
        </label>
        <div className="journey-search-spotlight relative rounded-2xl transition-shadow duration-300">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-plum-500"
            aria-hidden
          />
          <input
            id={inputId}
            type="search"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="Where to next?"
            className={cn(
              'h-12 w-full rounded-2xl border border-plum-600/12 bg-white/80 pl-11 pr-16 text-[13px] text-plum-900',
              'placeholder:text-plum-700/40 shadow-sm transition-all duration-300',
              'hover:border-plum-500/30 hover:bg-white/95',
              'focus:border-plum-500/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-plum-500/22',
            )}
            autoComplete="off"
            spellCheck={false}
          />
          <span className="pointer-events-none absolute right-9 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded-md bg-plum-600/6 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-plum-700/40 sm:flex">
            <Command size={9} aria-hidden />
            K
          </span>
          {value.length > 0 && (
            <motion.button
              type="button"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={onClear}
              className={cn(
                'absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-xl',
                'bg-plum-600/8 text-plum-700/55 transition-colors hover:bg-plum-100 hover:text-plum-800',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-plum-500/45',
              )}
              aria-label="Clear search"
            >
              <X size={14} aria-hidden />
            </motion.button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
