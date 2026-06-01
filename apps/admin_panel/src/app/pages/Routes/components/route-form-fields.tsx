import React from 'react';

import { Input } from '../../../components/ui/input';
import Label from '../../../components/ui/label';
import { Switch } from '../../../components/ui/switch';
import { RouteFormState } from './route-utils';

interface RouteFormFieldsProps {
  formData: RouteFormState;
  setFormData: React.Dispatch<React.SetStateAction<RouteFormState>>;
}

export function RouteFormFields({
  formData,
  setFormData,
}: RouteFormFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="route_name">Route Name</Label>
        <Input
          id="route_name"
          required
          value={formData.route_name}
          onChange={e =>
            setFormData({ ...formData, route_name: e.target.value })
          }
          placeholder="e.g. Bangalore → Hyderabad Express"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="route_code">Route Code (optional)</Label>
        <Input
          id="route_code"
          value={formData.route_code}
          onChange={e =>
            setFormData({ ...formData, route_code: e.target.value })
          }
          placeholder="Auto-generated if left blank"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="source_city">Source City</Label>
          <Input
            id="source_city"
            required
            value={formData.source_city}
            onChange={e =>
              setFormData({ ...formData, source_city: e.target.value })
            }
            placeholder="Bangalore"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="source_state">Source State</Label>
          <Input
            id="source_state"
            value={formData.source_state}
            onChange={e =>
              setFormData({ ...formData, source_state: e.target.value })
            }
            placeholder="Karnataka"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="destination_city">Destination City</Label>
          <Input
            id="destination_city"
            required
            value={formData.destination_city}
            onChange={e =>
              setFormData({ ...formData, destination_city: e.target.value })
            }
            placeholder="Hyderabad"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="destination_state">Destination State</Label>
          <Input
            id="destination_state"
            value={formData.destination_state}
            onChange={e =>
              setFormData({ ...formData, destination_state: e.target.value })
            }
            placeholder="Telangana"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="distance_km">Distance (km)</Label>
          <Input
            id="distance_km"
            type="number"
            min={0}
            value={formData.distance_km}
            onChange={e =>
              setFormData({ ...formData, distance_km: e.target.value })
            }
            placeholder="575"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (min)</Label>
          <Input
            id="duration"
            type="number"
            min={0}
            value={formData.estimated_duration_minutes}
            onChange={e =>
              setFormData({
                ...formData,
                estimated_duration_minutes: e.target.value,
              })
            }
            placeholder="540"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="base_fare">Base Fare (₹)</Label>
          <Input
            id="base_fare"
            type="number"
            min={0}
            value={formData.base_fare}
            onChange={e =>
              setFormData({ ...formData, base_fare: e.target.value })
            }
            placeholder="899"
          />
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
        <div>
          <p className="text-sm font-medium text-slate-700">Active</p>
          <p className="text-xs text-slate-500">
            Inactive routes are hidden from booking.
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
