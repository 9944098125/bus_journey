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

import { Button } from 'app/components/ui/button';
import { ConfirmationDialog } from 'app/components/ui/confirmation-dialog';
import { Input } from 'app/components/ui/input';
import Label from 'app/components/ui/label';
import { Switch } from 'app/components/ui/switch';
import { useToast } from 'app/components/ui/use-toast';
import {
  useCreateOperatorMutation,
  useDeleteOperatorMutation,
  useGetOperatorsQuery,
  useOperatorsEditor,
  useUploadDriverPhotoMutation,
  useUploadDrivingLicenseMutation,
  useUpdateOperatorMutation,
} from './slice';
import type { Operator, OperatorPayload } from 'types/operator';
import { parsePhoneFields } from 'utils/phone';
import 'react-phone-input-2/lib/style.css';

const defaultFormState: OperatorPayload = {
  operator_name: '',
  email: '',
  country_code: '+91',
  phone_number: '',
  logo: '',
  driver_photo: '',
  driving_license: '',
  gst_number: '',
  address: '',
  is_active: true,
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

export function Operators() {
  const { toast } = useToast();
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
  const [selectedDriverPhotoName, setSelectedDriverPhotoName] = useState('');
  const [driverPhotoUploadError, setDriverPhotoUploadError] = useState('');
  const [selectedLicenseName, setSelectedLicenseName] = useState('');
  const [licenseUploadError, setLicenseUploadError] = useState('');

  const queryParams = useMemo(
    () => (filterActiveOnly ? { is_active: true } : undefined),
    [filterActiveOnly],
  );
  const { data, isLoading, isFetching, refetch } =
    useGetOperatorsQuery(queryParams);
  const [createOperator, { isLoading: isCreating }] =
    useCreateOperatorMutation();
  const [updateOperator, { isLoading: isUpdating }] =
    useUpdateOperatorMutation();
  const [uploadDriverPhoto, { isLoading: isDriverPhotoUploading }] =
    useUploadDriverPhotoMutation();
  const [uploadDrivingLicense, { isLoading: isLicenseUploading }] =
    useUploadDrivingLicenseMutation();
  const [deleteOperator] = useDeleteOperatorMutation();

  const isSaving = isCreating || isUpdating;
  const editingId = editingOperator?._id ?? null;

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
      driver_photo: editingOperator.driver_photo || '',
      driving_license: editingOperator.driving_license || '',
      gst_number: editingOperator.gst_number || '',
      address: editingOperator.address || '',
      is_active: editingOperator.is_active,
    });
  }, [editingOperator]);

  const onFieldChange = (
    field: keyof OperatorPayload,
    value: string | boolean,
  ) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    clearEditingOperator();
    setSelectedDriverPhotoName('');
    setDriverPhotoUploadError('');
    setSelectedLicenseName('');
    setLicenseUploadError('');
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

  const onDriverPhotoChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const fileError = validateImageFile(file);
    if (fileError) {
      setDriverPhotoUploadError(fileError);
      return;
    }

    setDriverPhotoUploadError('');
    setSelectedDriverPhotoName(file.name);

    try {
      const uploadResult = await uploadDriverPhoto(file).unwrap();
      onFieldChange('driver_photo', uploadResult.imageUrl);
      toast({
        variant: 'success',
        title: 'Driver photo uploaded',
        description: 'Image uploaded and ready to be saved on submit.',
      });
    } catch (error) {
      setDriverPhotoUploadError(
        toErrorMessage(error, 'Failed to upload driver photo. Try again.'),
      );
    } finally {
      event.target.value = '';
    }
  };

  const onDrivingLicenseChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const fileError = validateImageFile(file);
    if (fileError) {
      setLicenseUploadError(fileError);
      return;
    }

    setLicenseUploadError('');
    setSelectedLicenseName(file.name);

    try {
      const uploadResult = await uploadDrivingLicense(file).unwrap();
      onFieldChange('driving_license', uploadResult.imageUrl);
      toast({
        variant: 'success',
        title: 'Driving license uploaded',
        description: 'Image uploaded and ready to be saved on submit.',
      });
    } catch (error) {
      setLicenseUploadError(
        toErrorMessage(error, 'Failed to upload driving license. Try again.'),
      );
    } finally {
      event.target.value = '';
    }
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingId && !formState.driver_photo?.trim()) {
      toast({
        title: 'Driver photo required',
        description: 'Please upload a driver photo before saving.',
        variant: 'error',
      });
      return;
    }

    if (
      !editingId &&
      !formState.driving_license?.trim()
    ) {
      toast({
        title: 'Driving license required',
        description: 'Please upload driving license before saving.',
        variant: 'error',
      });
      return;
    }

    try {
      const payload: OperatorPayload = {
        ...formState,
        operator_name: formState.operator_name.trim(),
        email: formState.email.trim(),
        country_code:
          formState.country_code.trim() || `+${phoneCountry.dialCode}`,
        phone_number: formState.phone_number.trim(),
        logo: formState.logo?.trim() || undefined,
        driver_photo: formState.driver_photo?.trim() || undefined,
        driving_license: formState.driving_license?.trim() || undefined,
        gst_number: formState.gst_number?.trim() || undefined,
        address: formState.address?.trim() || undefined,
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
                  inputClass="!h-10 !w-full !rounded-md !border !border-input !bg-background !pl-[56px] !text-sm !text-foreground !placeholder:text-muted-foreground"
                  buttonClass="!rounded-l-md !border !border-input !bg-background"
                  dropdownClass="!rounded-md !shadow-lg"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="gst_number">GST Number</Label>
                <Input
                  id="gst_number"
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
                  value={formState.logo}
                  onChange={event => onFieldChange('logo', event.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="driver_photo_upload">Driver Photo</Label>
                <div className="flex flex-wrap items-center gap-4 rounded-2xl border bg-slate-50 p-4">
                  <div className="size-24 overflow-hidden rounded-2xl border bg-white shadow-sm">
                    {formState.driver_photo ? (
                      <img
                        src={formState.driver_photo}
                        alt="Driver avatar"
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-slate-400">
                        <ImagePlus className="size-5" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-[240px] flex-1 space-y-1">
                    <p className="text-sm font-medium text-slate-700">
                      {selectedDriverPhotoName || 'Upload driver photo'}
                    </p>
                    <p className="text-xs text-slate-500">
                      JPG, PNG, WEBP up to 5MB
                    </p>
                    {driverPhotoUploadError && (
                      <p className="text-xs font-medium text-rose-600">
                        {driverPhotoUploadError}
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 min-w-[220px] rounded-xl border-sky-200 bg-sky-50 text-sky-700 shadow-sm hover:bg-sky-100"
                    onClick={() =>
                      document.getElementById('driver_photo_upload')?.click()
                    }
                    disabled={isDriverPhotoUploading || isSaving}
                  >
                    {isDriverPhotoUploading ? (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    ) : (
                      <UploadCloud className="mr-2 size-4" />
                    )}
                    {isDriverPhotoUploading
                      ? 'Uploading...'
                      : 'Choose Driver Photo'}
                  </Button>
                  {formState.driver_photo && (
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 rounded-xl border-rose-200 text-rose-700 hover:bg-rose-50"
                      onClick={() => {
                        onFieldChange('driver_photo', '');
                        setSelectedDriverPhotoName('');
                        setDriverPhotoUploadError('');
                      }}
                    >
                      <Trash2 className="mr-2 size-4" />
                      Remove
                    </Button>
                  )}
                  <input
                    id="driver_photo_upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={event => void onDriverPhotoChange(event)}
                  />
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="driving_license_upload">Driving License</Label>
                <div className="flex flex-wrap items-center gap-4 rounded-2xl border bg-slate-50 p-4">
                  <div className="size-24 overflow-hidden rounded-2xl border bg-white shadow-sm">
                    {formState.driving_license ? (
                      <img
                        src={formState.driving_license}
                        alt="Driving license"
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-slate-400">
                        <FileBadge2 className="size-5" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-[240px] flex-1 space-y-1">
                    <p className="text-sm font-medium text-slate-700">
                      {selectedLicenseName || 'Upload driving license image'}
                    </p>
                    <p className="text-xs text-slate-500">
                      JPG, PNG, WEBP up to 5MB
                    </p>
                    {licenseUploadError && (
                      <p className="text-xs font-medium text-rose-600">
                        {licenseUploadError}
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 min-w-[220px] rounded-xl border-indigo-200 bg-indigo-50 text-indigo-700 shadow-sm hover:bg-indigo-100"
                    onClick={() =>
                      document.getElementById('driving_license_upload')?.click()
                    }
                    disabled={isLicenseUploading || isSaving}
                  >
                    {isLicenseUploading ? (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    ) : (
                      <UploadCloud className="mr-2 size-4" />
                    )}
                    {isLicenseUploading
                      ? 'Uploading...'
                      : 'Choose Driving License'}
                  </Button>
                  {formState.driving_license && (
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 rounded-xl border-rose-200 text-rose-700 hover:bg-rose-50"
                      onClick={() => {
                        onFieldChange('driving_license', '');
                        setSelectedLicenseName('');
                        setLicenseUploadError('');
                      }}
                    >
                      <Trash2 className="mr-2 size-4" />
                      Remove
                    </Button>
                  )}
                  <input
                    id="driving_license_upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={event => void onDrivingLicenseChange(event)}
                  />
                </div>
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formState.address}
                  onChange={event =>
                    onFieldChange('address', event.target.value)
                  }
                  placeholder="Head office address"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#f2fbff] p-3">
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
              <Button
                type="submit"
                disabled={isSaving}
                className={`${actionButtonBase} bg-[#0077b6] text-white hover:-translate-y-0.5 hover:bg-[#036aa0] focus-visible:ring-[#0077b6]/50`}
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
            <div className="flex items-center gap-3 rounded-full border bg-white px-4 py-2">
              <Switch
                id="active-filter"
                checked={filterActiveOnly}
                onCheckedChange={setFilterActiveOnly}
              />
              <Label htmlFor="active-filter">Show Active Only</Label>
            </div>
          </div>

          {isLoading ? (
            <div className="rounded-3xl border border-dashed bg-white/70 p-8 text-center text-sm text-slate-600">
              Loading operators...
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
                    <div className="grid grid-cols-3 gap-3">
                      {operator.logo ? (
                        <img
                          src={operator.logo}
                          alt={`${operator.operator_name} logo`}
                          className="h-24 w-full rounded-2xl border border-slate-200 object-cover shadow-sm"
                        />
                      ) : (
                        <div className="flex h-24 w-full items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-slate-400">
                          <ImagePlus className="size-4" />
                        </div>
                      )}
                      {operator.driver_photo ? (
                        <img
                          src={operator.driver_photo}
                          alt={`${operator.operator_name} driver`}
                          className="h-24 w-full rounded-2xl border border-slate-200 object-cover shadow-sm"
                        />
                      ) : (
                        <div className="flex h-24 w-full items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-slate-400">
                          <ImagePlus className="size-4" />
                        </div>
                      )}
                      {operator.driving_license ? (
                        <img
                          src={operator.driving_license}
                          alt={`${operator.operator_name} driving license`}
                          className="h-24 w-full rounded-2xl border border-slate-200 object-cover shadow-sm"
                        />
                      ) : (
                        <div className="flex h-24 w-full items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-slate-400">
                          <ImagePlus className="size-4" />
                        </div>
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
