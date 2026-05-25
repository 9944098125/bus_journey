import React from 'react';
import { motion } from 'framer-motion';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';

import { useSidebar } from 'app/components/layout/sidebar-context';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from 'app/components/ui/tooltip';
import { cn } from 'utils/twm';

type SidebarToggleProps = {
  collapsed: boolean;
};

export default function SidebarToggle({ collapsed }: SidebarToggleProps) {
  const { isOpen, toggle } = useSidebar();

  const button = (
    <motion.button
      type="button"
      onClick={toggle}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        'relative flex items-center justify-center overflow-hidden rounded-2xl transition-colors duration-300',
        'bg-gradient-to-r from-plum-600/8 via-white/55 to-plum-400/10',
        'text-plum-700/75 ring-1 ring-plum-600/12',
        'hover:from-plum-600/14 hover:to-plum-400/18 hover:text-plum-900',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-plum-500/45',
        collapsed ? 'mx-auto size-10' : 'h-9 w-full gap-2 px-3',
      )}
      aria-expanded={isOpen}
      aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
    >
      <span
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.55),transparent)] opacity-0 transition-opacity duration-500 hover:opacity-100"
        aria-hidden
      />
      <motion.span
        key={isOpen ? 'open' : 'closed'}
        initial={{ x: isOpen ? 6 : -6, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.22 }}
        className="relative flex shrink-0"
      >
        {isOpen ? (
          <ChevronsLeft size={16} strokeWidth={2.25} aria-hidden />
        ) : (
          <ChevronsRight size={16} strokeWidth={2.25} aria-hidden />
        )}
      </motion.span>
      {!collapsed && (
        <span className="relative text-[12px] font-semibold">
          {isOpen ? 'Hide panel' : 'Show panel'}
        </span>
      )}
    </motion.button>
  );

  if (collapsed) {
    return (
      <div className="px-2 pb-2">
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side="right" className="bg-plum-900 text-white">
            {isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }

  return <div className="px-3 pb-2">{button}</div>;
}
