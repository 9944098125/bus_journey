import React from 'react';
import { motion } from 'framer-motion';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

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
    <button
      type="button"
      onClick={toggle}
      className={cn(
        'flex items-center justify-center rounded-2xl transition-all duration-300',
        'bg-white/5 text-white/60 ring-1 ring-white/10',
        'hover:bg-white/10 hover:text-white',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60',
        collapsed ? 'mx-auto size-10' : 'h-9 w-full gap-2 px-3',
      )}
      aria-expanded={isOpen}
      aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
    >
      <motion.span
        key={isOpen ? 'open' : 'closed'}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="flex shrink-0"
      >
        {isOpen ? (
          <PanelLeftClose size={16} strokeWidth={2} aria-hidden />
        ) : (
          <PanelLeftOpen size={16} strokeWidth={2} aria-hidden />
        )}
      </motion.span>
      {!collapsed && (
        <span className="text-[12px] font-medium">
          {isOpen ? 'Collapse' : 'Expand'}
        </span>
      )}
    </button>
  );

  if (collapsed) {
    return (
      <div className="px-2 pb-2">
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side="right">
            {isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }

  return <div className="px-3 pb-2">{button}</div>;
}
