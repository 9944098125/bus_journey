import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import type { CountryData } from 'react-phone-input-2';
import {
  Eye,
  FileBadge2,
  ImagePlus,
  Loader2,
  Plus,
  RefreshCw,
  Trash2,
  UploadCloud,
  X,
} from 'lucide-react';

import { Skeleton } from 'app/components/ui/skeleton';
import { Button } from 'app/components/ui/button';
import { ConfirmationDialog } from 'app/components/ui/confirmation-dialog';
import { Input } from 'app/components/ui/input';
import Label from 'app/components/ui/label';
import { Switch } from 'app/components/ui/switch';
import { useToast } from 'app/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'app/components/ui/select';
import {
  useCreateOperatorMutation,
  useDeleteOperatorMutation,
  useGetOperatorsQuery,
  useOperatorsEditor,
  useUpdateOperatorMutation,
} from './slice';
import {
  useUploadBusPhotoMutation,
  useGetBusesQuery,
  useUploadDriverPhotoMutation,
  useUploadDrivingLicenseMutation,
} from '../Buses/slice';
import type { Operator, OperatorPayload } from 'types/operator';
import { parsePhoneFields } from 'utils/phone';
import useDebounce from 'utils/hooks/debounce-hook';
import 'react-phone-input-2/lib/style.css';

const defaultFormState: OperatorPayload = {
  operator_name: '',
  email: '',
  country_code: '+91',
  phone_number: '',
  logo: '',
  gst_number: '',
  address: '',
  is_active: true,
  buses: [],
};

const DEFAULT_PHONE_COUNTRY: CountryData = {
  name: 'India',
  dialCode: '91',
  countryCode: 'in',
  format: '+.. .....-.....',
};

const toErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error === 'string') {
    return error;
  }

  if (error && typeof error === 'object' && 'data' in error) {
    const maybeData = (error as { data?: { message?: string } }).data;
    if (maybeData?.message) {
      return maybeData.message;
    }
  }

  return fallback;
};

const actionButtonBase =
  'h-12 rounded-xl px-5 text-sm font-semibold transition-all duration-200 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-offset-2';
const fieldControlClass =
  'h-[50px] w-full rounded-md border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground';
const phoneInputClass =
  '!h-[50px] !w-full !rounded-md !border !border-input !bg-background !pl-[56px] !text-sm !text-foreground !placeholder:text-muted-foreground';

export function Operators() {
  const { toast } = useToast();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);
  const { editingOperator, clearEditingOperator } = useOperatorsEditor();
  const [formState, setFormState] = useState<OperatorPayload>(defaultFormState);
  const [phoneCountry, setPhoneCountry] = useState<CountryData>(
    DEFAULT_PHONE_COUNTRY,
  );
  const [filterActiveOnly, setFilterActiveOnly] = useState(false);
  const [operatorBeingDeleted, setOperatorBeingDeleted] = useState<
    string | null
  >(null);
  const [operatorToDelete, setOperatorToDelete] = useState<Operator | null>(
    null,
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [searchInput, setSearchInput] = useState('');
  const debouncedSearchTerm = useDebounce(searchInput, 500);

  const queryParams = useMemo(
    () => {
      const params: { is_active?: boolean; search?: string } = {};
      if (filterActiveOnly) params.is_active = true;
      if (debouncedSearchTerm) params.search = debouncedSearchTerm;
      return Object.keys(params).length > 0 ? params : undefined;
    },
    [filterActiveOnly, debouncedSearchTerm],
  );
  const { data, isLoading, isFetching, refetch } =
    useGetOperatorsQuery(queryParams);
  const [createOperator, { isLoading: isCreating }] =
    useCreateOperatorMutation();
  const [updateOperator, { isLoading: isUpdating }] =
    useUpdateOperatorMutation();

  const [deleteOperator] = useDeleteOperatorMutation();

  const isSaving = isCreating || isUpdating;
  const editingId = editingOperator?._id ?? null;

  const { data: busesData, isFetching: isFetchingBuses } = useGetBusesQuery(
    editingId ? { operator: editingId } : undefined,
    { skip: !editingId }
  );

  useEffect(() => {
    if (!editingOperator) {
      setFormState(defaultFormState);
      return;
    }

    setFormState({
      operator_name: editingOperator.operator_name,
      email: editingOperator.email,
      country_code: editingOperator.country_code || '+91',
      phone_number: editingOperator.phone_number,
      logo: editingOperator.logo || '',
      gst_number: editingOperator.gst_number || '',
      address: editingOperator.address || '',
      is_active: editingOperator.is_active,
      buses: busesData?.data ? busesData.data.map(bus => ({
        _id: bus._id,
        bus_name: bus.bus_name,
        bus_number: bus.bus_number,
        bus_type: bus.bus_type,
        total_seats: bus.total_seats.toString(),
        amenities: Array.isArray(bus.amenities) ? bus.amenities.join(', ') : (bus.amenities || ''),
        photos: bus.photos || [],
        driver_photo: bus.driver_photo || '',
        driving_license: bus.driving_license || '',
      })) : [],
    });
  }, [editingOperator, busesData]);

  const onFieldChange = (
    field: keyof OperatorPayload,
    value: string | boolean,
  ) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  const [uploadBusPhoto] = useUploadBusPhotoMutation();
  const [uploadDriverPhoto, { isLoading: isDriverPhotoUploading }] =
    useUploadDriverPhotoMutation();
  const [uploadDrivingLicense, { isLoading: isLicenseUploading }] =
    useUploadDrivingLicenseMutation();
  const [uploadingBusPhotosIndex, setUploadingBusPhotosIndex] = useState<number | null>(null);
  const [uploadingBusDriverIndex, setUploadingBusDriverIndex] = useState<number | null>(null);
  const [uploadingBusLicenseIndex, setUploadingBusLicenseIndex] = useState<number | null>(null);

  const onBusPhotosChange = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploadingBusPhotosIndex(index);
      const uploadPromises = Array.from(files).map(file => uploadBusPhoto(file).unwrap());
      const results = await Promise.all(uploadPromises);
      const imageUrls = results.map(res => res.imageUrl);
      
      setFormState(prev => {
        const updatedBuses = [...(prev.buses || [])];
        const existingPhotos = updatedBuses[index].photos || [];
        updatedBuses[index] = { ...updatedBuses[index], photos: [...existingPhotos, ...imageUrls] };
        return { ...prev, buses: updatedBuses };
      });
      toast({ title: 'Photos uploaded successfully' });
    } catch (error) {
      toast({ title: 'Error uploading photos', variant: 'error' });
    } finally {
      setUploadingBusPhotosIndex(null);
    }
  };

  const removeBusPhoto = (busIndex: number, photoIndex: number) => {
    setFormState(prev => {
      const updatedBuses = [...(prev.buses || [])];
      const existingPhotos = [...(updatedBuses[busIndex].photos || [])];
      existingPhotos.splice(photoIndex, 1);
      updatedBuses[busIndex] = { ...updatedBuses[busIndex], photos: existingPhotos };
      return { ...prev, buses: updatedBuses };
    });
  };

  const onBusDriverPhotoChange = async (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const fileError = validateImageFile(file);
    if (fileError) {
      toast({ title: fileError, variant: 'error' });
      return;
    }

    try {
      setUploadingBusDriverIndex(index);
      const uploadResult = await uploadDriverPhoto(file).unwrap();
      onBusFieldChange(index, 'driver_photo', uploadResult.imageUrl);
      toast({ title: 'Driver photo uploaded', variant: 'success' });
    } catch (error) {
      toast({
        title: 'Failed to upload driver photo',
        description: toErrorMessage(error, 'Please try again.'),
        variant: 'error',
      });
    } finally {
      setUploadingBusDriverIndex(null);
      event.target.value = '';
    }
  };

  const onBusDrivingLicenseChange = async (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const fileError = validateImageFile(file);
    if (fileError) {
      toast({ title: fileError, variant: 'error' });
      return;
    }

    try {
      setUploadingBusLicenseIndex(index);
      const uploadResult = await uploadDrivingLicense(file).unwrap();
      onBusFieldChange(index, 'driving_license', uploadResult.imageUrl);
      toast({ title: 'Driving license uploaded', variant: 'success' });
    } catch (error) {
      toast({
        title: 'Failed to upload driving license',
        description: toErrorMessage(error, 'Please try again.'),
        variant: 'error',
      });
    } finally {
      setUploadingBusLicenseIndex(null);
      event.target.value = '';
    }
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
        }
      ]
    }));
  };

  const removeBus = (index: number) => {
    setFormState(prev => ({
      ...prev,
      buses: prev.buses?.filter((_, i) => i !== index) || []
    }));
  };

  const onBusFieldChange = (index: number, field: string, value: string | number) => {
    setFormState(prev => {
      const newBuses = [...(prev.buses || [])];
      newBuses[index] = { ...newBuses[index], [field]: value };
      return { ...prev, buses: newBuses };
    });
  };

  const resetForm = () => {
    clearEditingOperator();
  };

  const validateImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      return 'Please upload a valid image file.';
    }

    if (file.size > 5 * 1024 * 1024) {
      return 'Image must be smaller than 5 MB.';
    }

    return '';
  };


  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingId && (!formState.buses || formState.buses.length === 0)) {
      toast({
        title: 'Validation Error',
        description: 'An operator must have at least one bus.',
        variant: 'error',
      });
      return;
    }

    if (!editingId && formState.buses?.some(bus => !bus.driver_photo?.trim())) {
      toast({
        title: 'Validation Error',
        description: 'Each bus must have a driver photo before submitting.',
        variant: 'error',
      });
      return;
    }

    if (!editingId && formState.buses?.some(bus => !bus.driving_license?.trim())) {
      toast({
        title: 'Validation Error',
        description: 'Each bus must have a driving license before submitting.',
        variant: 'error',
      });
      return;
    }

    try {
      const payload: OperatorPayload & { buses?: any[] } = {
        ...formState,
        operator_name: formState.operator_name.trim(),
        email: formState.email.trim(),
        country_code:
          formState.country_code.trim() || `+${phoneCountry.dialCode}`,
        phone_number: formState.phone_number.trim(),
        logo: formState.logo?.trim() || undefined,
        gst_number: formState.gst_number?.trim() || undefined,
        address: formState.address?.trim() || undefined,
        buses: formState.buses?.map(bus => {
          let seats = 40;
          if (bus.total_seats === "25 seats") seats = 25;
          else if (bus.total_seats === "50 seats") seats = 50;
          else if (bus.total_seats === "15 bearths up & down") seats = 30;
          else if (bus.total_seats === "25 bearths up & down") seats = 50;
          else if (typeof bus.total_seats === 'number') seats = bus.total_seats;
          else seats = parseInt(bus.total_seats as string) || 40;

          return {
            ...bus,
            total_seats: seats,
            amenities: bus.amenities.split(',').map(a => a.trim()).filter(Boolean),
            driver_photo: bus.driver_photo?.trim() || undefined,
            driving_license: bus.driving_license?.trim() || undefined,
          };
        }) || [],
      };
      if (editingId) {
        await updateOperator({ id: editingId, payload }).unwrap();
        toast({
          variant: 'success',
          title: 'Operator updated',
          description: 'Changes saved successfully.',
        });
      } else {
        await createOperator(payload).unwrap();
        toast({
          variant: 'success',
          title: 'Operator created',
          description: 'New operator has been added.',
        });
      }
      resetForm();
    } catch (error) {
      toast({
        title: 'Unable to save operator',
        description: toErrorMessage(
          error,
          'Please review input and try again.',
        ),
        variant: 'error',
      });
    }
  };

  const onDeleteRequest = (operator: Operator) => {
    setOperatorToDelete(operator);
    setIsDeleteDialogOpen(true);
  };

  const onDelete = async () => {
    if (!operatorToDelete) {
      return;
    }

    setOperatorBeingDeleted(operatorToDelete._id);
    try {
      await deleteOperator(operatorToDelete._id).unwrap();
      toast({
        variant: 'success',
        title: 'Operator deleted',
        description: 'Operator removed from the list.',
      });
      if (editingId === operatorToDelete._id) {
        resetForm();
      }
      setIsDeleteDialogOpen(false);
      setOperatorToDelete(null);
    } catch (error) {
      toast({
        title: 'Delete failed',
        description: toErrorMessage(error, 'Please try again in a moment.'),
        variant: 'error',
      });
    } finally {
      setOperatorBeingDeleted(null);
    }
  };

  return (
    <>
      <Helmet>
        <title>Operators</title>
        <meta
          name="description"
          content="Manage bus operators with add, update, delete, and detail view."
        />
      </Helmet>

      <div className="mx-auto max-w-[1500px] space-y-6">
        <section className="rounded-3xl bg-gradient-to-r from-[#023047] via-[#0077b6] to-[#00b4d8] p-6 text-white shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Operator Control Hub
              </h1>
              <p className="mt-1 text-sm text-white/85">
                Add, update, and remove operators with a live admin view.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              className={`${actionButtonBase} border-white/60 bg-white/10 text-white hover:-translate-y-0.5 hover:bg-white/20 focus-visible:ring-white/70 focus-visible:ring-offset-transparent`}
              onClick={() => void refetch()}
              disabled={isFetching}
              aria-busy={isFetching}
            >
              <RefreshCw
                className={`mr-2 size-4 ${isFetching ? 'animate-spin' : ''}`}
              />
              {isFetching ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </section>

        <section className="rounded-3xl border border-white/50 bg-white/80 p-5 shadow-sm backdrop-blur">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-[#023047]">
              {editingId ? 'Update Operator' : 'Add Operator'}
            </h2>
            {editingId && (
              <Button
                type="button"
                variant="outline"
                className={`${actionButtonBase} border-slate-200 text-slate-700 hover:bg-slate-50 focus-visible:ring-slate-300`}
                onClick={resetForm}
              >
                <X className="mr-1.5 size-4" />
                Cancel Edit
              </Button>
            )}
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="operator_name">Operator Name</Label>
                <Input
                  id="operator_name"
                  className={fieldControlClass}
                  value={formState.operator_name}
                  onChange={event =>
                    onFieldChange('operator_name', event.target.value)
                  }
                  placeholder="Blue Line Travels"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  className={fieldControlClass}
                  value={formState.email}
                  onChange={event => onFieldChange('email', event.target.value)}
                  placeholder="ops@blueline.com"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone_number">Phone Number</Label>
                <PhoneInput
                  country="in"
                  value={`${(formState.country_code || '').replace('+', '')}${formState.phone_number || ''}`}
                  onChange={(phone, country) => {
                    if (
                      country &&
                      typeof country === 'object' &&
                      'dialCode' in country
                    ) {
                      const nextCountry = country as CountryData;
                      setPhoneCountry(nextCountry);
                      const parsed = parsePhoneFields(phone, nextCountry);
                      onFieldChange('country_code', parsed.country_code);
                      onFieldChange('phone_number', parsed.phone_number);
                      return;
                    }

                    onFieldChange('phone_number', phone.trim());
                  }}
                  inputProps={{
                    id: 'phone_number',
                    name: 'phone_number',
                    required: true,
                  }}
                  containerClass="register-phone-input w-full"
                  inputClass={phoneInputClass}
                  buttonClass="!rounded-l-md !border !border-input !bg-background"
                  dropdownClass="!rounded-md !shadow-lg"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="gst_number">GST Number</Label>
                <Input
                  id="gst_number"
                  className={fieldControlClass}
                  value={formState.gst_number}
                  onChange={event =>
                    onFieldChange('gst_number', event.target.value)
                  }
                  placeholder="29ABCDE1234F1Z5"
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="logo">Logo URL</Label>
                <Input
                  id="logo"
                  className={fieldControlClass}
                  value={formState.logo}
                  onChange={event => onFieldChange('logo', event.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  className={fieldControlClass}
                  value={formState.address}
                  onChange={event =>
                    onFieldChange('address', event.target.value)
                  }
                  placeholder="Head office address"
                />
              </div>
            </div>

            {!editingId && (
              <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">Buses</h3>
                  <p className="text-sm text-slate-500">Add buses to this operator directly.</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className={`${actionButtonBase} border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus-visible:ring-slate-300`}
                  onClick={addBus}
                >
                  <Plus className="mr-2 size-4" />
                  Add Bus
                </Button>
              </div>
              
              {formState.buses && formState.buses.length > 0 && (
                <div className="space-y-4">
                  {formState.buses.map((bus, index) => (
                    <div key={index} className="relative rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 h-8 w-8 text-rose-500 hover:bg-rose-50 hover:text-rose-600"
                        onClick={() => removeBus(index)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                      <h4 className="mb-3 text-sm font-medium text-slate-700">Bus #{index + 1}</h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                          <Label htmlFor={`bus_name_${index}`}>Bus Name</Label>
                          <Input
                            id={`bus_name_${index}`}
                            className={fieldControlClass}
                            value={bus.bus_name}
                            onChange={(e) => onBusFieldChange(index, 'bus_name', e.target.value)}
                            placeholder="e.g. SRS Travels Express"
                            required
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor={`bus_number_${index}`}>Bus Number</Label>
                          <Input
                            id={`bus_number_${index}`}
                            className={fieldControlClass}
                            value={bus.bus_number}
                            onChange={(e) => onBusFieldChange(index, 'bus_number', e.target.value)}
                            placeholder="e.g. KA 01 AB 1234"
                            required
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor={`bus_type_${index}`}>Bus Type</Label>
                          <Select 
                            value={bus.bus_type} 
                            onValueChange={(val) => onBusFieldChange(index, 'bus_type', val)}
                            required
                          >
                            <SelectTrigger id={`bus_type_${index}`} className={fieldControlClass}>
                              <SelectValue placeholder="Select Bus Type" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              <SelectItem value="semi sleeper">Semi Sleeper</SelectItem>
                              <SelectItem value="sleeper">Sleeper</SelectItem>
                              <SelectItem value="mini bus">Mini Bus</SelectItem>
                              <SelectItem value="tour bus/charter">Tour Bus / Charter</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor={`total_seats_${index}`}>Total Seats</Label>
                          <Select 
                            value={bus.total_seats?.toString()} 
                            onValueChange={(val) => onBusFieldChange(index, 'total_seats', val)}
                            required
                          >
                            <SelectTrigger id={`total_seats_${index}`} className={fieldControlClass}>
                              <SelectValue placeholder="Select Total Seats" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              <SelectItem value="25 seats">25 seats</SelectItem>
                              <SelectItem value="50 seats">50 seats</SelectItem>
                              <SelectItem value="15 bearths up & down">15 bearths up &amp; down</SelectItem>
                              <SelectItem value="25 bearths up & down">25 bearths up &amp; down</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                          <Label htmlFor={`amenities_${index}`}>Amenities (comma separated)</Label>
                          <Input
                            id={`amenities_${index}`}
                            className={fieldControlClass}
                            value={bus.amenities}
                            onChange={(e) => onBusFieldChange(index, 'amenities', e.target.value)}
                            placeholder="e.g. WiFi, Water Bottle, Blanket"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor={`driver_photo_upload_${index}`}>Driver Photo</Label>
                          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                            <div className="h-14 w-14 overflow-hidden rounded-lg border bg-white">
                              {bus.driver_photo ? (
                                <img
                                  src={bus.driver_photo}
                                  alt={`Bus ${index} driver`}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-slate-400">
                                  <ImagePlus className="size-4" />
                                </div>
                              )}
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              className="h-10 px-6 border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                              onClick={() =>
                                document
                                  .getElementById(`driver_photo_upload_${index}`)
                                  ?.click()
                              }
                              disabled={isDriverPhotoUploading && uploadingBusDriverIndex === index}
                            >
                              {isDriverPhotoUploading && uploadingBusDriverIndex === index ? (
                                <Loader2 className="mr-2 size-4 animate-spin" />
                              ) : (
                                <UploadCloud className="mr-2 size-4" />
                              )}
                              Upload
                            </Button>
                            {bus.driver_photo && (
                              <Button
                                type="button"
                                variant="outline"
                                className="h-10 border-rose-200 text-rose-700 hover:bg-rose-50"
                                onClick={() => onBusFieldChange(index, 'driver_photo', '')}
                              >
                                Remove
                              </Button>
                            )}
                            <input
                              id={`driver_photo_upload_${index}`}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={event => void onBusDriverPhotoChange(index, event)}
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor={`driving_license_upload_${index}`}>Driving License</Label>
                          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                            <div className="h-14 w-14 overflow-hidden rounded-lg border bg-white">
                              {bus.driving_license ? (
                                <img
                                  src={bus.driving_license}
                                  alt={`Bus ${index} driving license`}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-slate-400">
                                  <FileBadge2 className="size-4" />
                                </div>
                              )}
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              className="h-10 px-6 border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                              onClick={() =>
                                document
                                  .getElementById(`driving_license_upload_${index}`)
                                  ?.click()
                              }
                              disabled={isLicenseUploading && uploadingBusLicenseIndex === index}
                            >
                              {isLicenseUploading && uploadingBusLicenseIndex === index ? (
                                <Loader2 className="mr-2 size-4 animate-spin" />
                              ) : (
                                <UploadCloud className="mr-2 size-4" />
                              )}
                              Upload
                            </Button>
                            {bus.driving_license && (
                              <Button
                                type="button"
                                variant="outline"
                                className="h-10 border-rose-200 text-rose-700 hover:bg-rose-50"
                                onClick={() => onBusFieldChange(index, 'driving_license', '')}
                              >
                                Remove
                              </Button>
                            )}
                            <input
                              id={`driving_license_upload_${index}`}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={event => void onBusDrivingLicenseChange(index, event)}
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                          <Label>Bus Photos</Label>
                          <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                              <Button
                                type="button"
                                variant="outline"
                                className="border-slate-200 bg-white text-slate-700 hover:bg-slate-50 h-12 px-6 text-base"
                                onClick={() => document.getElementById(`bus_photos_${index}`)?.click()}
                              >
                                <UploadCloud className="mr-2 h-5 w-5" />
                                Upload Photos
                              </Button>
                              <input
                                id={`bus_photos_${index}`}
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={(e) => onBusPhotosChange(index, e)}
                              />
                              <span className="text-sm text-slate-500">
                                {bus.photos?.length || 0} photo(s) selected
                              </span>
                            </div>
                            {(bus.photos && bus.photos.length > 0) || uploadingBusPhotosIndex === index ? (
                              <div className="flex flex-wrap gap-2">
                                {bus.photos?.map((photoUrl, pIndex) => (
                                  <div key={pIndex} className="relative group">
                                    <img
                                      src={photoUrl}
                                      alt={`Bus ${index} Photo ${pIndex}`}
                                      className="h-16 w-16 rounded-md object-cover border border-slate-200"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => removeBusPhoto(index, pIndex)}
                                      className="absolute -top-2 -right-2 hidden group-hover:flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-white shadow-sm"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </div>
                                ))}
                                {uploadingBusPhotosIndex === index && (
                                  <Skeleton className="h-16 w-16 rounded-md" />
                                )}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            )}

            <div className="rounded-2xl bg-[#f2fbff] p-3">
              <div className="flex items-center gap-3">
                <Switch
                  id="is_active"
                  checked={Boolean(formState.is_active)}
                  onCheckedChange={checked =>
                    onFieldChange('is_active', checked)
                  }
                />
                <Label htmlFor="is_active">Operator Active</Label>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSaving}
                className={`${actionButtonBase} min-w-[190px] bg-[#0077b6] text-white hover:-translate-y-0.5 hover:bg-[#036aa0] focus-visible:ring-[#0077b6]/50`}
                aria-busy={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Plus className="mr-2 size-4" />
                )}
                {isSaving
                  ? editingId
                    ? 'Updating...'
                    : 'Adding...'
                  : editingId
                  ? 'Update Operator'
                  : 'Add Operator'}
              </Button>
            </div>
          </form>
        </section>

        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-[#023047]">
              Operators List
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <Input 
                  placeholder="Search operators..." 
                  className="h-12 w-[280px] pl-10 pr-4 text-base rounded-xl border-slate-300 focus:border-[#0077b6] focus:ring-[#0077b6] transition-all shadow-sm"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
              <div className="flex h-12 items-center gap-3 rounded-full border bg-white px-5">
                <Switch
                  id="active-filter"
                  checked={filterActiveOnly}
                  onCheckedChange={setFilterActiveOnly}
                />
                <Label htmlFor="active-filter">Show Active Only</Label>
              </div>
            </div>
          </div>

          {(isLoading || isInitialLoading) ? (
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <article
                  key={i}
                  className="rounded-3xl border border-white/50 bg-white p-5 shadow-sm"
                >
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1 space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                  <div className="mt-3 space-y-3">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <Skeleton className="h-40 w-full rounded-2xl" />
                      <Skeleton className="h-40 w-full rounded-2xl" />
                      <Skeleton className="h-40 w-full rounded-2xl" />
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-1 gap-x-3 gap-y-4 lg:grid-cols-2">
                    <Skeleton className="h-14 w-full rounded-xl" />
                    <Skeleton className="h-14 w-full rounded-xl" />
                  </div>
                </article>
              ))}
            </div>
          ) : data?.data?.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {data.data.map(operator => (
                <article
                  key={operator._id}
                  className="group rounded-3xl border border-white/50 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-semibold text-[#023047]">
                        {operator.operator_name}
                      </h3>
                      <p className="truncate text-sm text-slate-500">
                        {operator.email}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        operator.is_active
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {operator.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="mt-3 space-y-3 text-sm text-slate-600">
                    <div className="space-y-1">
                      <p>
                        Phone: {operator.country_code} {operator.phone_number}
                      </p>
                      {operator.gst_number && <p>GST: {operator.gst_number}</p>}
                      {operator.address && (
                        <p className="line-clamp-1">{operator.address}</p>
                      )}
                    </div>
                    <div className="mt-4">
                      {operator.logo && (
                        <img
                          src={operator.logo}
                          alt={`${operator.operator_name} logo`}
                          className="h-32 w-auto max-w-full rounded-xl border border-slate-200 object-contain shadow-sm"
                        />
                      )}
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-x-3 gap-y-4 lg:grid-cols-2">
                    <Button
                      asChild
                      className={`${actionButtonBase} h-14 w-full justify-center bg-[#0077b6] text-white hover:bg-[#036aa0] focus-visible:ring-[#0077b6]/50`}
                    >
                      <Link to={`/operators/${operator._id}`}>
                        <Eye className="mr-2 size-5" />
                        <span>View Details</span>
                      </Link>
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      className={`${actionButtonBase} h-14 w-full justify-center bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-300`}
                      onClick={() => onDeleteRequest(operator)}
                      disabled={operatorBeingDeleted === operator._id}
                      aria-busy={operatorBeingDeleted === operator._id}
                    >
                      {operatorBeingDeleted === operator._id ? (
                        <Loader2 className="mr-2 size-5 animate-spin" />
                      ) : (
                        <Trash2 className="mr-2 size-5" />
                      )}
                      {operatorBeingDeleted === operator._id
                        ? 'Deleting...'
                        : 'Delete'}
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed bg-white/70 p-8 text-center text-sm text-slate-600">
              No operators found. Add your first operator from the form above.
            </div>
          )}
        </section>
      </div>
      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={open => {
          if (!operatorBeingDeleted) {
            setIsDeleteDialogOpen(open);
            if (!open) {
              setOperatorToDelete(null);
            }
          }
        }}
        title="Delete operator?"
        description={
          operatorToDelete
            ? `You are about to permanently delete "${operatorToDelete.operator_name}". This action cannot be undone.`
            : 'This action cannot be undone.'
        }
        confirmText="Delete operator"
        cancelText="Keep operator"
        onConfirm={() => void onDelete()}
        isConfirming={Boolean(operatorBeingDeleted)}
      />
    </>
  );
}
