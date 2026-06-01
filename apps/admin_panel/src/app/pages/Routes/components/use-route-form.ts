import React, { useEffect, useState } from 'react';

import { useToast } from '../../../components/ui/use-toast';
import { useCreateRouteMutation, useUpdateRouteMutation } from '../slice';
import {
  CreateRouteMutationArg,
  RouteItem,
  RouteStopPayload,
} from '../slice/types';
import {
  EMPTY_FORM,
  FormStop,
  RouteFormState,
  decimalHoursToMinutes,
  makeEmptyStop,
  minutesToDecimalHours,
} from './route-utils';

interface UseRouteFormArgs {
  editingRoute: RouteItem | null;
  open: boolean;
  onClose: () => void;
}

export function useRouteForm({ editingRoute, open, onClose }: UseRouteFormArgs) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<RouteFormState>(EMPTY_FORM);

  const [createRoute, { isLoading: isCreating }] = useCreateRouteMutation();
  const [updateRoute, { isLoading: isUpdating }] = useUpdateRouteMutation();
  const isSubmitting = isCreating || isUpdating;

  useEffect(() => {
    if (!open) return;
    if (editingRoute) {
      setFormData({
        route_name: editingRoute.route_name,
        route_code: editingRoute.route_code,
        source_city: editingRoute.source_city,
        source_state: editingRoute.source_state ?? '',
        destination_city: editingRoute.destination_city,
        destination_state: editingRoute.destination_state ?? '',
        distance_km: String(editingRoute.distance_km),
        estimated_duration: minutesToDecimalHours(
          editingRoute.estimated_duration_minutes,
        ),
        base_fare: String(editingRoute.base_fare),
        is_active: editingRoute.is_active,
        stops: editingRoute.stops
          .slice()
          .sort((a, b) => a.sequence - b.sequence)
          .map((stop, index) => ({
            id: `existing-stop-${index}`,
            stop_name: stop.stop_name,
            city: stop.city,
            landmark: stop.landmark ?? '',
            stop_type: stop.stop_type,
            distance_from_source_km: String(stop.distance_from_source_km ?? ''),
            arrival_offset: minutesToDecimalHours(
              stop.arrival_offset_minutes ?? 0,
            ),
          })),
      });
    } else {
      setFormData({ ...EMPTY_FORM, stops: [makeEmptyStop(), makeEmptyStop()] });
    }
  }, [open, editingRoute]);

  const updateStop = (id: string, patch: Partial<FormStop>) => {
    setFormData(prev => ({
      ...prev,
      stops: prev.stops.map(stop =>
        stop.id === id ? { ...stop, ...patch } : stop,
      ),
    }));
  };

  const addStop = () =>
    setFormData(prev => ({ ...prev, stops: [...prev.stops, makeEmptyStop()] }));

  const removeStop = (id: string) =>
    setFormData(prev => ({
      ...prev,
      stops: prev.stops.filter(stop => stop.id !== id),
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!formData.route_name.trim()) {
      toast({ title: 'Route name is required', variant: 'error' });
      return;
    }
    if (!formData.source_city.trim() || !formData.destination_city.trim()) {
      toast({
        title: 'Source and destination cities are required',
        variant: 'error',
      });
      return;
    }
    if (
      formData.source_city.trim().toLowerCase() ===
      formData.destination_city.trim().toLowerCase()
    ) {
      toast({
        title: 'Source and destination cannot be the same',
        variant: 'error',
      });
      return;
    }

    const stops: RouteStopPayload[] = formData.stops
      .filter(stop => stop.stop_name.trim() && stop.city.trim())
      .map((stop, index) => ({
        stop_name: stop.stop_name.trim(),
        city: stop.city.trim(),
        landmark: stop.landmark?.trim() || undefined,
        stop_type: stop.stop_type,
        sequence: index + 1,
        distance_from_source_km: Number(stop.distance_from_source_km) || 0,
        arrival_offset_minutes:
          decimalHoursToMinutes(stop.arrival_offset) || 0,
      }));

    const payload: CreateRouteMutationArg = {
      route_name: formData.route_name.trim(),
      source_city: formData.source_city.trim(),
      source_state: formData.source_state.trim() || undefined,
      destination_city: formData.destination_city.trim(),
      destination_state: formData.destination_state.trim() || undefined,
      distance_km: Number(formData.distance_km) || 0,
      estimated_duration_minutes:
        decimalHoursToMinutes(formData.estimated_duration) || 0,
      base_fare: Number(formData.base_fare) || 0,
      is_active: formData.is_active,
      stops,
    };

    const routeCode = formData.route_code.trim().toUpperCase();
    if (routeCode) {
      payload.route_code = routeCode;
    }

    try {
      if (editingRoute) {
        await updateRoute({ id: editingRoute._id, ...payload }).unwrap();
        toast({
          title: 'Success',
          description: 'Route updated successfully',
          variant: 'success',
        });
      } else {
        await createRoute(payload).unwrap();
        toast({
          title: 'Success',
          description: 'Route created successfully',
          variant: 'success',
        });
      }
      onClose();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error || 'Failed to save route',
        variant: 'error',
      });
    }
  };

  return {
    formData,
    setFormData,
    updateStop,
    addStop,
    removeStop,
    handleSubmit,
    isSubmitting,
  };
}
