import React from 'react';

import { Input } from '../../../components/ui/input';
import Label from '../../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { Switch } from '../../../components/ui/switch';
import type { Bus } from '../../Buses/slice/types';
import type { Route } from '../../Routes/slice/types';
import { JourneyFormState } from './journey-utils';
import { JOURNEY_STATUS_LABELS } from './journey-utils';
import type { JourneyStatus } from '../slice/types';

interface JourneyFormFieldsProps {
  formData: JourneyFormState;
  setFormData: React.Dispatch<React.SetStateAction<JourneyFormState>>;
  routes: Route[];
  buses: Bus[];
  onRouteChange: (routeId: string) => void;
  onBusChange: (busId: string) => void;
  isEditing: boolean;
  seatsDisplay?: string;
}

export function JourneyFormFields({
  formData,
  setFormData,
  routes,
  buses,
  onRouteChange,
  onBusChange,
  isEditing,
  seatsDisplay,
}: JourneyFormFieldsProps) {
  const selectedRoute = routes.find(r => r._id === formData.route);
  const selectedBus = buses.find(b => b._id === formData.bus);

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="journey_code">Journey Code (optional)</Label>
        <Input
          id="journey_code"
          value={formData.journey_code}
          onChange={e =>
            setFormData({ ...formData, journey_code: e.target.value })
          }
          placeholder="Auto-generated if left blank"
          disabled={isEditing}
        />
        {isEditing && (
          <p className="text-xs text-slate-400">
            Journey code cannot be changed after creation.
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="route">Route</Label>
        <Select value={formData.route} onValueChange={onRouteChange} required>
          <SelectTrigger id="route" className="h-[4.4rem] px-5 text-base">
            <SelectValue placeholder="Select a route" />
          </SelectTrigger>
          <SelectContent className="max-h-64 bg-white">
            {routes.length === 0 ? (
              <SelectItem value="__none" disabled>
                No active routes available
              </SelectItem>
            ) : (
              routes.map(route => (
                <SelectItem key={route._id} value={route._id} className="py-2.5">
                  <div className="flex flex-col text-left">
                    <span className="font-medium">{route.route_name}</span>
                    <span className="text-xs text-slate-400">
                      {route.source_city} → {route.destination_city} ·{' '}
                      {route.route_code}
                    </span>
                  </div>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bus">Bus</Label>
        <Select value={formData.bus} onValueChange={onBusChange} required>
          <SelectTrigger id="bus" className="h-[4.4rem] px-5 text-base">
            <SelectValue placeholder="Select a bus" />
          </SelectTrigger>
          <SelectContent className="max-h-64 bg-white">
            {buses.length === 0 ? (
              <SelectItem value="__none" disabled>
                No active buses available
              </SelectItem>
            ) : (
              buses.map(bus => (
                <SelectItem key={bus._id} value={bus._id} className="py-2.5">
                  <div className="flex flex-col text-left">
                    <span className="font-medium">{bus.bus_name}</span>
                    <span className="text-xs text-slate-400">
                      {bus.bus_number} · {bus.total_seats}
                    </span>
                  </div>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {selectedBus && (
          <p className="text-sm text-slate-600">
            <span className="font-medium text-slate-700">Seats:</span>{' '}
            {selectedBus.total_seats}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="departure_at">Departure</Label>
        <Input
          id="departure_at"
          type="datetime-local"
          required
          value={formData.departure_at}
          onChange={e =>
            setFormData({ ...formData, departure_at: e.target.value })
          }
        />
        {selectedRoute && (
          <p className="text-xs text-slate-400">
            Estimated travel time:{' '}
            {Math.floor(selectedRoute.estimated_duration_minutes / 60)}h{' '}
            {selectedRoute.estimated_duration_minutes % 60}m (arrival calculated
            on save)
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="fare">Fare (₹)</Label>
        <Input
          id="fare"
          type="number"
          min={0}
          value={formData.fare}
          onChange={e => setFormData({ ...formData, fare: e.target.value })}
          placeholder="899"
        />
      </div>

      {isEditing && seatsDisplay && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-sm font-medium text-slate-700">Bus seats</p>
          <p className="mt-0.5 text-base text-slate-900">{seatsDisplay}</p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="status">Journey status</Label>
        <Select
          value={formData.status}
          onValueChange={val =>
            setFormData({ ...formData, status: val as JourneyStatus })
          }
        >
          <SelectTrigger id="status" className="h-[4.4rem] px-5 text-base">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {(Object.keys(JOURNEY_STATUS_LABELS) as JourneyStatus[]).map(
              status => (
                <SelectItem key={status} value={status} className="py-2.5">
                  {JOURNEY_STATUS_LABELS[status]}
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Input
          id="notes"
          value={formData.notes}
          onChange={e => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Special instructions, gate number, etc."
        />
      </div>

      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
        <div>
          <p className="text-sm font-medium text-slate-700">Active</p>
          <p className="text-xs text-slate-500">
            Inactive journeys are hidden from booking.
          </p>
        </div>
        <Switch
          checked={formData.is_active}
          onCheckedChange={checked =>
            setFormData({ ...formData, is_active: checked })
          }
        />
      </div>
    </>
  );
}
