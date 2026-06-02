import React, { useEffect, useState } from 'react';

import { useToast } from '../../../components/ui/use-toast';
import {
  useCreateBusMutation,
  useUpdateBusMutation,
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
  source_location: string;
  photos?: string[];
}

const EMPTY_FORM: BusFormData = {
  bus_name: '',
  bus_number: '',
  bus_type: '',
  total_seats: '25 seats',
  operator: '',
  amenities: '',
  source_location: '',
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
  const [uploadBusPhoto] = useUploadBusPhotoMutation();

  const [formData, setFormData] = useState<BusFormData>(EMPTY_FORM);
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (editingBus) {
      setFormData({
        bus_name: editingBus.bus_name,
        bus_number: editingBus.bus_number,
        bus_type: editingBus.bus_type,
        total_seats: totalSeatsToSelectValue(editingBus.total_seats),
        operator: editingBus.operator?._id || '',
        amenities: editingBus.amenities.join(', '),
        source_location: editingBus.source_location || '',
        photos: editingBus.photos || [],
      });
    } else {
      setFormData(EMPTY_FORM);
    }
  }, [open, editingBus]);



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
    if (!formData.source_location?.trim()) {
      toast({
        title: 'Error',
        description: 'Please specify the source location.',
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
    isUploadingPhotos,
    isCreating,
    isUpdating,
    onBusPhotosChange,
    removeBusPhoto,
    handleSubmit,
  };
}
