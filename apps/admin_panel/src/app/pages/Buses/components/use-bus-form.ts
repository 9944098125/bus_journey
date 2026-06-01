import React, { useEffect, useState } from 'react';

import { useToast } from '../../../components/ui/use-toast';
import {
  useCreateBusMutation,
  useUpdateBusMutation,
  useUploadDriverPhotoMutation,
  useUploadDrivingLicenseMutation,
  useUploadBusPhotoMutation,
} from '../slice';
import { Bus } from '../slice/types';
import { totalSeatsToSelectValue } from 'utils/busSeats';

export interface BusFormData {
  bus_name: string;
  bus_number: string;
  bus_type: string;
  total_seats: string;
  operator: string;
  amenities: string;
  driver_photo: string;
  driving_license: string;
  photos?: string[];
}

const EMPTY_FORM: BusFormData = {
  bus_name: '',
  bus_number: '',
  bus_type: '',
  total_seats: '25 seats',
  operator: '',
  amenities: '',
  driver_photo: '',
  driving_license: '',
  photos: [],
};

function validateImageFile(file: File): string {
  if (!file.type.startsWith('image/'))
    return 'Please upload a valid image file.';
  if (file.size > 5 * 1024 * 1024) return 'Image must be smaller than 5 MB.';
  return '';
}

interface UseBusFormArgs {
  editingBus: Bus | null;
  open: boolean;
  onClose: () => void;
}

export function useBusForm({ editingBus, open, onClose }: UseBusFormArgs) {
  const { toast } = useToast();

  const [createBus, { isLoading: isCreating }] = useCreateBusMutation();
  const [updateBus, { isLoading: isUpdating }] = useUpdateBusMutation();
  const [uploadDriverPhoto, { isLoading: isDriverPhotoUploading }] =
    useUploadDriverPhotoMutation();
  const [uploadDrivingLicense, { isLoading: isLicenseUploading }] =
    useUploadDrivingLicenseMutation();
  const [uploadBusPhoto] = useUploadBusPhotoMutation();

  const [formData, setFormData] = useState<BusFormData>(EMPTY_FORM);
  const [selectedDriverPhotoName, setSelectedDriverPhotoName] = useState('');
  const [driverPhotoUploadError, setDriverPhotoUploadError] = useState('');
  const [selectedLicenseName, setSelectedLicenseName] = useState('');
  const [licenseUploadError, setLicenseUploadError] = useState('');
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSelectedDriverPhotoName('');
    setDriverPhotoUploadError('');
    setSelectedLicenseName('');
    setLicenseUploadError('');

    if (editingBus) {
      setFormData({
        bus_name: editingBus.bus_name,
        bus_number: editingBus.bus_number,
        bus_type: editingBus.bus_type,
        total_seats: totalSeatsToSelectValue(editingBus.total_seats),
        operator: editingBus.operator?._id || '',
        amenities: editingBus.amenities.join(', '),
        driver_photo: editingBus.driver_photo || '',
        driving_license: editingBus.driving_license || '',
        photos: editingBus.photos || [],
      });
    } else {
      setFormData(EMPTY_FORM);
    }
  }, [open, editingBus]);

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

  const onBusPhotosChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      setIsUploadingPhotos(true);
      const results = await Promise.all(
        Array.from(files).map(file => uploadBusPhoto(file).unwrap()),
      );
      const imageUrls = results.map(res => res.imageUrl);
      setFormData(prev => ({
        ...prev,
        photos: [...(prev.photos || []), ...imageUrls],
      }));
      toast({ title: 'Photos uploaded successfully', variant: 'success' });
    } catch (error) {
      toast({ title: 'Error uploading photos', variant: 'error' });
    } finally {
      setIsUploadingPhotos(false);
    }
  };

  const removeBusPhoto = (photoIndex: number) => {
    setFormData(prev => {
      const existingPhotos = [...(prev.photos || [])];
      existingPhotos.splice(photoIndex, 1);
      return { ...prev, photos: existingPhotos };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBus && !formData.driver_photo?.trim()) {
      toast({
        title: 'Error',
        description: 'Please upload a driver photo.',
        variant: 'error',
      });
      return;
    }
    if (!editingBus && !formData.driving_license?.trim()) {
      toast({
        title: 'Error',
        description: 'Please upload driving license.',
        variant: 'error',
      });
      return;
    }
    const payload = {
      ...formData,
      total_seats: formData.total_seats,
      amenities: formData.amenities
        .split(',')
        .map(a => a.trim())
        .filter(Boolean),
    };
    try {
      if (editingBus) {
        await updateBus({ id: editingBus._id, ...payload }).unwrap();
        toast({
          title: 'Success',
          description: 'Bus updated successfully',
          variant: 'success',
        });
      } else {
        await createBus(payload).unwrap();
        toast({
          title: 'Success',
          description: 'Bus created successfully',
          variant: 'success',
        });
      }
      onClose();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error || 'Operation failed',
        variant: 'error',
      });
    }
  };

  return {
    formData,
    setFormData,
    selectedDriverPhotoName,
    driverPhotoUploadError,
    selectedLicenseName,
    licenseUploadError,
    isUploadingPhotos,
    isCreating,
    isUpdating,
    isDriverPhotoUploading,
    isLicenseUploading,
    onDriverPhotoChange,
    onDrivingLicenseChange,
    onBusPhotosChange,
    removeBusPhoto,
    handleSubmit,
  };
}
