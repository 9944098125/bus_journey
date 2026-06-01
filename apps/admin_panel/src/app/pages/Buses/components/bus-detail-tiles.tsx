import React from 'react';
import { ImageOff } from 'lucide-react';

interface DetailTileProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}

export function DetailTile({ icon: Icon, label, value }: DetailTileProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
      <div className="flex items-center gap-2 text-slate-500">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-semibold uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p
        className="mt-1.5 truncate text-base font-semibold capitalize text-slate-800"
        title={value}
      >
        {value}
      </p>
    </div>
  );
}

interface DocumentTileProps {
  label: string;
  src?: string;
  onOpen: () => void;
}

export function DocumentTile({ label, src, onOpen }: DocumentTileProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
      {src ? (
        <button
          type="button"
          onClick={onOpen}
          className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-200 transition-transform hover:scale-105"
          title={`Open ${label.toLowerCase()}`}
        >
          <img src={src} alt={label} className="h-full w-full object-cover" />
        </button>
      ) : (
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
          <ImageOff className="h-6 w-6" />
        </div>
      )}
      <div>
        <p className="text-sm font-semibold text-slate-700">{label}</p>
        <p className="text-xs text-slate-400">
          {src ? 'Tap to view full size' : 'Not provided'}
        </p>
      </div>
    </div>
  );
}
