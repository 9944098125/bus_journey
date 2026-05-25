import React from 'react';
import { Activity, Waves } from 'lucide-react';

const AdminStatusBar = () => {
  return (
    <footer
      className="sticky bottom-0 z-30 flex h-9 shrink-0 items-center justify-between border-t border-sea-light/45 bg-gradient-to-r from-sea-deep via-sea-deep/98 to-sea-mid/90 px-4 text-[1.1rem] text-sea-light backdrop-blur-md"
      role="contentinfo"
    >
      <span className="flex items-center gap-2 font-medium">
        <Waves className="size-3.5 text-sea-bright" aria-hidden />
        Admin Panel v0.1
      </span>
      <span className="flex items-center gap-2">
        <Activity className="size-3.5 text-sea-accent" aria-hidden />
        <span className="hidden sm:inline">Systems nominal</span>
      </span>
    </footer>
  );
};

export default AdminStatusBar;
