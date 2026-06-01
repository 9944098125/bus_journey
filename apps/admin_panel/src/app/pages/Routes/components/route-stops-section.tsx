import React from 'react';
import { MapPin, Plus } from 'lucide-react';

import { Button } from '../../../components/ui/button';
import { FormStop } from './route-utils';
import { RouteStopEditor } from './route-stop-editor';

interface RouteStopsSectionProps {
  stops: FormStop[];
  onAddStop: () => void;
  onUpdateStop: (id: string, patch: Partial<FormStop>) => void;
  onRemoveStop: (id: string) => void;
}

export function RouteStopsSection({
  stops,
  onAddStop,
  onUpdateStop,
  onRemoveStop,
}: RouteStopsSectionProps) {
  return (
    <div className="space-y-3 rounded-xl border border-slate-200 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[#0077b6]" />
            <span className="text-sm font-semibold text-slate-700">
              Stops ({stops.length})
            </span>
          </div>
          <p className="text-xs leading-snug text-slate-500">
            Add boarding and dropping points in travel order, starting from the
            source city. Their sequence is set automatically.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 shrink-0 rounded-lg border-[#0077b6]/30 text-[#0077b6] hover:bg-[#0077b6]/5"
          onClick={onAddStop}
        >
          <Plus className="mr-1.5 h-4 w-4" /> Add Stop
        </Button>
      </div>

      {stops.length === 0 && (
        <p className="rounded-lg bg-slate-50 px-3 py-4 text-center text-sm text-slate-400">
          No stops added yet. Click “Add Stop” to create the first boarding
          point.
        </p>
      )}

      <div className="space-y-3">
        {stops.map((stop, index) => (
          <RouteStopEditor
            key={stop.id}
            stop={stop}
            index={index}
            onChange={onUpdateStop}
            onRemove={onRemoveStop}
          />
        ))}
      </div>
    </div>
  );
}
