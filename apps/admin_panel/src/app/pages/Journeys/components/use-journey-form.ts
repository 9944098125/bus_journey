import React, { useEffect, useState } from 'react';

import { useToast } from '../../../components/ui/use-toast';
import { useGetBusesQuery } from '../../Buses/slice';
import { useGetRoutesQuery } from '../../Routes/slice';
import {
  useCreateJourneyMutation,
  useUpdateJourneyMutation,
  useUploadDriverPhotoMutation,
  useUploadDrivingLicenseMutation,
} from '../slice';
import { CreateJourneyMutationArg, JourneyItem } from '../slice/types';
import {
  EMPTY_JOURNEY_FORM,
  JourneyFormState,
  fromDatetimeLocalValue,
  getJourneyBusId,
  getJourneyRouteId,
  toDatetimeLocalValue,
} from './journey-utils';

interface UseJourneyFormArgs {
  editingJourney: JourneyItem | null;
  open: boolean;
  onClose: () => void;
}

export function useJourneyForm({
  editingJourney,
  open,
  onClose,
}: UseJourneyFormArgs) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<JourneyFormState>(EMPTY_JOURNEY_FORM);

  const { data: routesResponse } = useGetRoutesQuery(
    { limit: 200, status: 'active' },
    { skip: !open },
  );
  const { data: busesResponse } = useGetBusesQuery(
    { limit: 200, is_active: true },
    { skip: !open },
  );

  const routes = routesResponse?.data ?? [];
  const buses = busesResponse?.data ?? [];

  const [createJourney, { isLoading: isCreating }] = useCreateJourneyMutation();
  const [updateJourney, { isLoading: isUpdating }] = useUpdateJourneyMutation();
  const [uploadDriverPhoto, { isLoading: isDriverPhotoUploading }] =
    useUploadDriverPhotoMutation();
  const [uploadDrivingLicense, { isLoading: isLicenseUploading }] =
    useUploadDrivingLicenseMutation();

  const [selectedDriverPhotoName, setSelectedDriverPhotoName] = useState('');
  const [driverPhotoUploadError, setDriverPhotoUploadError] = useState('');
  const [selectedLicenseName, setSelectedLicenseName] = useState('');
  const [licenseUploadError, setLicenseUploadError] = useState('');

  const isSubmitting = isCreating || isUpdating;

  const validateImageFile = (file: File): string => {
    if (!file.type.startsWith('image/'))
      return 'Please upload a valid image file.';
    if (file.size > 5 * 1024 * 1024) return 'Image must be smaller than 5 MB.';
    return '';
  };

  useEffect(() => {
    if (!open) return;

    if (editingJourney) {
      setFormData({
        journey_code: editingJourney.journey_code,
        route: getJourneyRouteId(editingJourney),
        bus: getJourneyBusId(editingJourney),
        departure_at: toDatetimeLocalValue(editingJourney.departure_at),
        fare: String(editingJourney.fare),
        status: editingJourney.status,
        is_active: editingJourney.is_active,
        notes: editingJourney.notes ?? '',
        driver_photo: editingJourney.driver_photo ?? '',
        driving_license: editingJourney.driving_license ?? '',
      });
    } else {
      setFormData(EMPTY_JOURNEY_FORM);
    }
  }, [open, editingJourney]);

  const onRouteChange = (routeId: string) => {
    const route = routes.find(r => r._id === routeId);
    setFormData(prev => ({
      ...prev,
      route: routeId,
      fare: route ? String(route.base_fare) : prev.fare,
    }));
  };

  const onBusChange = (busId: string) => {
    setFormData(prev => ({ ...prev, bus: busId }));
  };

  const onDriverPhotoChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const fileError = validateImageFile(file);
    if (fileError) {
      setDriverPhotoUploadError(fileError);
      return;
    }
    setDriverPhotoUploadError('');
    setSelectedDriverPhotoName(file.name);
    try {
      const uploadResult = await uploadDriverPhoto(file).unwrap();
      setFormData(prev => ({ ...prev, driver_photo: uploadResult.imageUrl }));
      toast({
        variant: 'success',
        title: 'Driver photo uploaded',
        description: 'Image uploaded and ready to be saved.',
      });
    } catch (error: any) {
      setDriverPhotoUploadError(
        error?.data?.message || error?.message || 'Failed to upload photo.',
      );
    } finally {
      event.target.value = '';
    }
  };

  const onDrivingLicenseChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const fileError = validateImageFile(file);
    if (fileError) {
      setLicenseUploadError(fileError);
      return;
    }
    setLicenseUploadError('');
    setSelectedLicenseName(file.name);
    try {
      const uploadResult = await uploadDrivingLicense(file).unwrap();
      setFormData(prev => ({
        ...prev,
        driving_license: uploadResult.imageUrl,
      }));
      toast({
        variant: 'success',
        title: 'Driving license uploaded',
        description: 'Image uploaded and ready to be saved.',
      });
    } catch (error: any) {
      setLicenseUploadError(
        error?.data?.message || error?.message || 'Failed to upload license.',
      );
    } finally {
      event.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.route) {
      toast({ title: 'Route is required', variant: 'error' });
      return;
    }
    if (!formData.bus) {
      toast({ title: 'Bus is required', variant: 'error' });
      return;
    }
    if (!formData.departure_at) {
      toast({ title: 'Departure date and time is required', variant: 'error' });
      return;
    }

    const payload: CreateJourneyMutationArg = {
      route: formData.route,
      bus: formData.bus,
      departure_at: fromDatetimeLocalValue(formData.departure_at),
      fare: Number(formData.fare) || 0,
      status: formData.status,
      is_active: formData.is_active,
      notes: formData.notes.trim() || undefined,
      driver_photo: formData.driver_photo.trim() || undefined,
      driving_license: formData.driving_license.trim() || undefined,
    };

    const code = formData.journey_code.trim().toUpperCase();
    if (code) {
      payload.journey_code = code;
    }

    if (editingJourney) {
      payload.available_seats = editingJourney.available_seats;
    }

    try {
      if (editingJourney) {
        await updateJourney({ id: editingJourney._id, ...payload }).unwrap();
        toast({
          title: 'Success',
          description: 'Journey updated successfully',
          variant: 'success',
        });
      } else {
        await createJourney(payload).unwrap();
        toast({
          title: 'Success',
          description: 'Journey created successfully',
          variant: 'success',
        });
      }
      onClose();
    } catch (error: any) {
      const errorMessage = error?.data?.message || (typeof error === 'string' ? error : 'Failed to save journey');
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'error',
      });
    }
  };

  return {
    formData,
    setFormData,
    routes,
    buses,
    onRouteChange,
    onBusChange,
    onDriverPhotoChange,
    onDrivingLicenseChange,
    selectedDriverPhotoName,
    driverPhotoUploadError,
    selectedLicenseName,
    licenseUploadError,
    isDriverPhotoUploading,
    isLicenseUploading,
    handleSubmit,
    isSubmitting,
  };
}
