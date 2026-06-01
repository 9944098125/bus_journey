import React from 'react';
import { Trash2 } from 'lucide-react';

import { Input } from '../../../components/ui/input';
import Label from '../../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '../../../components/ui/select';
import { RouteStopType } from '../slice/types';
import { FormStop } from './route-utils';

interface RouteStopEditorProps {
  stop: FormStop;
  index: number;
  onChange: (id: string, patch: Partial<FormStop>) => void;
  onRemove: (id: string) => void;
}

const STOP_TYPE_OPTIONS: {
  value: RouteStopType;
  label: string;
  description: string;
}[] = [
  {
    value: 'boarding',
    label: 'Boarding',
    description: 'Passengers can only get on here',
  },
  {
    value: 'dropping',
    label: 'Dropping',
    description: 'Passengers can only get off here',
  },
  {
    value: 'both',
    label: 'Both',
    description: 'Passengers can get on and off here',
  },
];

const FieldHint = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs leading-snug text-slate-400">{children}</p>
);

const RequiredMark = () => (
  <span className="ml-0.5 text-rose-500" aria-hidden>
    *
  </span>
);

export function RouteStopEditor({
  stop,
  index,
  onChange,
  onRemove,
}: RouteStopEditorProps) {
  const fieldId = (name: string) => `stop-${stop.id}-${name}`;

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0077b6] text-xs font-bold text-white">
            {index + 1}
          </span>
          Stop {index + 1}
        </span>
        <button
          type="button"
          onClick={() => onRemove(stop.id)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
          title="Remove stop"
          aria-label="Remove stop"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={fieldId('name')}>
            Stop name
            <RequiredMark />
          </Label>
          <Input
            id={fieldId('name')}
            value={stop.stop_name}
            onChange={e => onChange(stop.id, { stop_name: e.target.value })}
            placeholder="e.g. Majestic Bus Stand"
          />
          <FieldHint>Name of the bus stand or stop point.</FieldHint>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor={fieldId('city')}>
            City
            <RequiredMark />
          </Label>
          <Input
            id={fieldId('city')}
            value={stop.city}
            onChange={e => onChange(stop.id, { city: e.target.value })}
            placeholder="e.g. Bangalore"
          />
          <FieldHint>City this stop is located in.</FieldHint>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor={fieldId('landmark')}>Landmark (optional)</Label>
          <Input
            id={fieldId('landmark')}
            value={stop.landmark ?? ''}
            onChange={e => onChange(stop.id, { landmark: e.target.value })}
            placeholder="e.g. Near Railway Station"
          />
          <FieldHint>A nearby landmark to help passengers find it.</FieldHint>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor={fieldId('type')}>Stop type</Label>
          <Select
            value={stop.stop_type}
            onValueChange={val =>
              onChange(stop.id, { stop_type: val as RouteStopType })
            }
          >
            <SelectTrigger
              id={fieldId('type')}
              className="h-[4.4rem] px-5 text-base"
            >
              <span className="truncate">
                {STOP_TYPE_OPTIONS.find(o => o.value === stop.stop_type)
                  ?.label ?? 'Select stop type'}
              </span>
            </SelectTrigger>
            <SelectContent className="bg-white">
              {STOP_TYPE_OPTIONS.map(option => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="py-2.5"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-700">
                      {option.label}
                    </span>
                    <span className="text-xs text-slate-400">
                      {option.description}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldHint>
            Controls whether passengers can board, drop, or both at this stop.
          </FieldHint>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor={fieldId('distance')}>Distance (km)</Label>
          <Input
            id={fieldId('distance')}
            type="number"
            min={0}
            inputMode="numeric"
            value={stop.distance_from_source_km}
            onChange={e =>
              onChange(stop.id, {
                distance_from_source_km: e.target.value,
              })
            }
            placeholder="e.g. 210"
          />
          <FieldHint>Kilometres travelled from the first stop.</FieldHint>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor={fieldId('offset')}>Arrival offset (min)</Label>
          <Input
            id={fieldId('offset')}
            type="number"
            min={0}
            inputMode="numeric"
            value={stop.arrival_offset_minutes}
            onChange={e =>
              onChange(stop.id, {
                arrival_offset_minutes: e.target.value,
              })
            }
            placeholder="e.g. 195"
          />
          <FieldHint>Minutes after departure from the source city.</FieldHint>
        </div>
      </div>
    </div>
  );
}
