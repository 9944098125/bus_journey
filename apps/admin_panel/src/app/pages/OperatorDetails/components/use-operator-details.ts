import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { CountryData } from 'react-phone-input-2';

import { useToast } from 'app/components/ui/use-toast';
import {
  useDeleteOperatorMutation,
  useGetOperatorByIdQuery,
  useUpdateOperatorMutation,
} from 'app/pages/Operators/slice';
import { useGetBusesQuery } from 'app/pages/Buses/slice';
import type { OperatorPayload } from 'types/operator';
import { totalSeatsToSelectValue } from 'utils/busSeats';
import { parsePhoneFields } from 'utils/phone';

import {
  buildOperatorPayload,
  validateOperatorBuses,
} from './operator-payload';
import {
  DEFAULT_PHONE_COUNTRY,
  defaultFormState,
  toErrorMessage,
} from './operator-constants';

export function useOperatorDetails() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id = '' } = useParams<{ id: string }>();
  const [phoneCountry, setPhoneCountry] = useState<CountryData>(
    DEFAULT_PHONE_COUNTRY,
  );

  const {
    data,
    isLoading,
    isError,
    refetch: refetchOperator,
  } = useGetOperatorByIdQuery(id, { skip: !id });
  const {
    data: busesResponse,
    isFetching: isFetchingBuses,
    refetch: refetchBuses,
  } = useGetBusesQuery(id ? { operator: id, limit: 100 } : undefined, {
    skip: !id,
  });
  const [updateOperator, { isLoading: isUpdating }] =
    useUpdateOperatorMutation();
  const [deleteOperator, { isLoading: isDeleting }] =
    useDeleteOperatorMutation();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formState, setFormState] = useState<OperatorPayload>(defaultFormState);

  useEffect(() => {
    if (!data?.data) return;
    setFormState(prev => ({
      operator_name: data.data.operator_name,
      email: data.data.email,
      country_code: data.data.country_code || '+91',
      phone_number: data.data.phone_number,
      logo: data.data.logo || '',
      gst_number: data.data.gst_number || '',
      address: data.data.address || '',
      is_active: data.data.is_active,
      buses: busesResponse?.data
        ? busesResponse.data.map(bus => ({
            _id: bus._id,
            bus_name: bus.bus_name,
            bus_number: bus.bus_number,
            bus_type: bus.bus_type,
            total_seats: totalSeatsToSelectValue(bus.total_seats),
            amenities: Array.isArray(bus.amenities)
              ? bus.amenities.join(', ')
              : bus.amenities || '',
            photos: bus.photos || [],
            driver_photo: bus.driver_photo || '',
            driving_license: bus.driving_license || '',
          }))
        : prev.buses || [],
    }));
  }, [data, busesResponse]);

  const onFieldChange = (
    field: keyof OperatorPayload,
    value: string | boolean,
  ) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  const onPhoneChange = (phone: string, country: CountryData | {}) => {
    if (country && typeof country === 'object' && 'dialCode' in country) {
      const nextCountry = country as CountryData;
      setPhoneCountry(nextCountry);
      const parsed = parsePhoneFields(phone, nextCountry);
      onFieldChange('country_code', parsed.country_code);
      onFieldChange('phone_number', parsed.phone_number);
      return;
    }
    onFieldChange('phone_number', phone.trim());
  };

  const onBusFieldChange = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    setFormState(prev => {
      const newBuses = [...(prev.buses || [])];
      newBuses[index] = { ...newBuses[index], [field]: value };
      return { ...prev, buses: newBuses };
    });
  };

  const onBusPhotosChange = (index: number, urls: string[]) => {
    setFormState(prev => {
      const updatedBuses = [...(prev.buses || [])];
      updatedBuses[index] = { ...updatedBuses[index], photos: urls };
      return { ...prev, buses: updatedBuses };
    });
  };

  const onBusDriverPhotoChange = (index: number, url: string) =>
    onBusFieldChange(index, 'driver_photo', url);
  const onBusDrivingLicenseChange = (index: number, url: string) =>
    onBusFieldChange(index, 'driving_license', url);

  const removeBusPhoto = (busIndex: number, photoIndex: number) => {
    setFormState(prev => {
      const updatedBuses = [...(prev.buses || [])];
      const existingPhotos = [...(updatedBuses[busIndex].photos || [])];
      existingPhotos.splice(photoIndex, 1);
      updatedBuses[busIndex] = {
        ...updatedBuses[busIndex],
        photos: existingPhotos,
      };
      return { ...prev, buses: updatedBuses };
    });
  };

  const addBus = () => {
    setFormState(prev => ({
      ...prev,
      buses: [
        ...(prev.buses || []),
        {
          bus_name: '',
          bus_number: '',
          bus_type: '',
          total_seats: '',
          amenities: '',
          photos: [],
          driver_photo: '',
          driving_license: '',
        },
      ],
    }));
  };

  const removeBus = (index: number) => {
    setFormState(prev => ({
      ...prev,
      buses: prev.buses?.filter((_, i) => i !== index) || [],
    }));
  };

  const onUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!id) return;

    const validationError = validateOperatorBuses(formState.buses);
    if (validationError) {
      toast({
        title: 'Validation Error',
        description: validationError,
        variant: 'error',
      });
      return;
    }

    try {
      const payload = buildOperatorPayload(formState, phoneCountry);
      await updateOperator({ id, payload }).unwrap();
      await Promise.all([refetchOperator(), refetchBuses()]);
      toast({
        variant: 'success',
        title: 'Operator updated',
        description: 'All changes saved successfully.',
      });
    } catch (error) {
      toast({
        title: 'Update failed',
        description: toErrorMessage(
          error,
          'Unable to update operator right now.',
        ),
        variant: 'error',
      });
    }
  };

  const onDelete = async () => {
    if (!id) return;
    try {
      await deleteOperator(id).unwrap();
      toast({
        variant: 'success',
        title: 'Operator deleted',
        description: 'Operator removed successfully.',
      });
      setIsDeleteDialogOpen(false);
      navigate('/operators');
    } catch (error) {
      toast({
        title: 'Delete failed',
        description: toErrorMessage(error, 'Please try again shortly.'),
        variant: 'error',
      });
    }
  };

  return {
    operator: data?.data,
    isLoading,
    isError,
    isFetchingBuses,
    isUpdating,
    isDeleting,
    formState,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    onFieldChange,
    onPhoneChange,
    onBusFieldChange,
    onBusPhotosChange,
    onBusDriverPhotoChange,
    onBusDrivingLicenseChange,
    removeBusPhoto,
    addBus,
    removeBus,
    onUpdate,
    onDelete,
  };
}
