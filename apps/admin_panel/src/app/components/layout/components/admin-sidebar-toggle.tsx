import React from 'react';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

import { Switch } from 'app/components/ui/switch';
import { useSidebar } from 'app/components/layout/sidebar-context';
import { cn } from 'utils/twm';

export default function AdminSidebarToggle({ expanded }: { expanded: boolean }) {
  const { isOpen, setIsOpen } = useSidebar();

  return (
    <div
      className={cn(
        'mt-auto border-t border-white/10 px-2 pt-3',
        expanded ? 'px-3' : 'flex flex-col items-center',
      )}
    >
      <label
        className={cn(
          'group flex cursor-pointer items-center gap-3 rounded-xl transition-colors',
          expanded
            ? 'w-full bg-white/5 px-3 py-2.5 hover:bg-white/10'
            : 'flex-col gap-2 py-2',
        )}
      >
        <span
          className={cn(
            'flex shrink-0 items-center justify-center rounded-lg bg-white/10 text-sea-pale',
            expanded ? 'size-9' : 'size-10',
          )}
          aria-hidden
        >
          {isOpen ? (
            <PanelLeftClose size={18} strokeWidth={2} />
          ) : (
            <PanelLeftOpen size={18} strokeWidth={2} />
          )}
        </span>

        {expanded && (
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-semibold text-sea-pale">
              Sidebar
            </span>
            <span className="block text-[1rem] font-medium text-white/70">
              {isOpen ? 'Expanded' : 'Collapsed'}
            </span>
          </span>
        )}

        <Switch
          checked={isOpen}
          onCheckedChange={setIsOpen}
          aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          className={cn(
            'shrink-0 border border-white/20 bg-sea-deep/80 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-sea-bright data-[state=checked]:to-sea-light data-[state=unchecked]:bg-sea-deep/60',
            '[&>span]:bg-white [&>span]:shadow-md data-[state=checked]:[&>span]:translate-x-5',
          )}
        />
      </label>

      {!expanded && (
        <span className="mt-1 text-[0.9rem] font-medium uppercase tracking-wider text-sea-light/70">
          Menu
        </span>
      )}
    </div>
  );
}
