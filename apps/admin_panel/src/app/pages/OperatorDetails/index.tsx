import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import type { CountryData } from 'react-phone-input-2';
import {
  ArrowLeft,
  FileBadge2,
  ImagePlus,
  Loader2,
  Save,
  Trash2,
  UploadCloud,
} from 'lucide-react';

import { Button } from 'app/components/ui/button';
import { ConfirmationDialog } from 'app/components/ui/confirmation-dialog';
import { Input } from 'app/components/ui/input';
import Label from 'app/components/ui/label';
import { Switch } from 'app/components/ui/switch';
import { useToast } from 'app/components/ui/use-toast';
import {
  useDeleteOperatorMutation,
  useGetOperatorByIdQuery,
  useOperatorsSlice,
  useUploadDriverPhotoMutation,
  useUploadDrivingLicenseMutation,
  useUpdateOperatorMutation,
} from 'app/pages/Operators/slice';
import type { OperatorPayload } from 'types/operator';
import { parsePhoneFields } from 'utils/phone';
import 'react-phone-input-2/lib/style.css';

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

const detailActionButtonBase =
  'h-14 rounded-2xl px-7 text-base font-semibold transition-all duration-200 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-offset-2';

export function OperatorDetails() {
  useOperatorsSlice();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id = '' } = useParams<{ id: string }>();

  const { data, isLoading, isError } = useGetOperatorByIdQuery(id, {
    skip: !id,
  });
  const [updateOperator, { isLoading: isUpdating }] =
    useUpdateOperatorMutation();
  const [uploadDriverPhoto, { isLoading: isDriverPhotoUploading }] =
    useUploadDriverPhotoMutation();
  const [uploadDrivingLicense, { isLoading: isLicenseUploading }] =
    useUploadDrivingLicenseMutation();
  const [deleteOperator, { isLoading: isDeleting }] =
    useDeleteOperatorMutation();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formState, setFormState] = useState<OperatorPayload>({
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
  });
  const [phoneCountry, setPhoneCountry] = useState<CountryData>(
    DEFAULT_PHONE_COUNTRY,
  );
  const [selectedDriverPhotoName, setSelectedDriverPhotoName] = useState('');
  const [driverPhotoUploadError, setDriverPhotoUploadError] = useState('');
  const [selectedLicenseName, setSelectedLicenseName] = useState('');
  const [licenseUploadError, setLicenseUploadError] = useState('');

  useEffect(() => {
    if (data?.data) {
      setFormState({
        operator_name: data.data.operator_name,
        email: data.data.email,
        country_code: data.data.country_code || '+91',
        phone_number: data.data.phone_number,
        logo: data.data.logo || '',
        driver_photo: data.data.driver_photo || '',
        driving_license: data.data.driving_license || '',
        gst_number: data.data.gst_number || '',
        address: data.data.address || '',
        is_active: data.data.is_active,
      });
    }
  }, [data]);

  const onFieldChange = (
    field: keyof OperatorPayload,
    value: string | boolean,
  ) => {
    setFormState(prev => ({ ...prev, [field]: value }));
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

  const onUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!id) {
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

      await updateOperator({
        id,
        payload,
      }).unwrap();

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
    if (!id) {
      return;
    }

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

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-dashed bg-white/70 p-8 text-center">
        Loading operator details...
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="space-y-4 rounded-3xl border bg-white p-8 text-center">
        <p className="text-sm text-slate-600">
          Unable to load this operator. It may have been removed.
        </p>
        <Button asChild>
          <Link to="/operators">Back to Operators</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{data.data.operator_name}</title>
        <meta name="description" content="View and manage a single operator." />
      </Helmet>

      <div className="mx-auto w-full max-w-[1800px] space-y-6 px-4 2xl:px-6">
        <div className="grid gap-6 lg:grid-cols-5 2xl:gap-8">
          <aside className="lg:col-span-1">
            <section className="sticky top-4 rounded-3xl border border-white/60 bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                Operator Logo
              </h2>
              {data.data.logo ? (
                <img
                  src={data.data.logo}
                  alt={`${data.data.operator_name} logo`}
                  className="h-48 w-full rounded-2xl border border-slate-100 object-contain bg-slate-50 p-3"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-3 text-center text-sm text-slate-500">
                  No logo URL added
                </div>
              )}
              <div className="mt-4">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Driver Photo
                </h3>
                {formState.driver_photo ? (
                  <img
                    src={formState.driver_photo}
                    alt={`${data.data.operator_name} driver`}
                    className="h-44 w-full rounded-2xl border border-slate-100 object-cover bg-slate-50"
                  />
                ) : (
                  <div className="flex h-44 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
                    No driver photo
                  </div>
                )}
              </div>
              <div className="mt-4">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Driving License
                </h3>
                {formState.driving_license ? (
                  <img
                    src={formState.driving_license}
                    alt={`${data.data.operator_name} driving license`}
                    className="h-44 w-full rounded-2xl border border-slate-100 object-cover bg-slate-50"
                  />
                ) : (
                  <div className="flex h-44 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
                    No driving license
                  </div>
                )}
              </div>
            </section>
          </aside>

          <main className="space-y-5 lg:col-span-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Button
                asChild
                variant="ghost"
                className={`${detailActionButtonBase} border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus-visible:ring-slate-300`}
              >
                <Link to="/operators">
                  <ArrowLeft className="mr-2 size-4" />
                  Back to Operators
                </Link>
              </Button>
              <Button
                type="button"
                variant="destructive"
                className={`${detailActionButtonBase} border border-rose-700 bg-rose-600 text-white shadow-sm hover:bg-rose-700 focus-visible:ring-rose-300`}
                onClick={() => setIsDeleteDialogOpen(true)}
                disabled={isDeleting}
              >
                <Trash2 className="mr-2 size-4" />
                {isDeleting ? 'Deleting...' : 'Delete Operator'}
              </Button>
            </div>

            <section className="rounded-3xl border border-white/60 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="mb-1 text-3xl font-bold text-[#023047]">
                    {data.data.operator_name}
                  </h1>
                  <p className="text-sm text-slate-500">
                    Created at {new Date(data.data.createdAt).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    data.data.is_active
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  {data.data.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </section>

            <section className="rounded-3xl border border-white/60 bg-white p-8 shadow-sm 2xl:p-10">
              <h2 className="mb-4 text-xl font-semibold text-[#023047]">
                Update Operator Details
              </h2>
              <form onSubmit={onUpdate} className="space-y-4">
                <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3 2xl:gap-6">
                  <div className="space-y-1.5">
                    <Label htmlFor="operator_name">Operator Name</Label>
                    <Input
                      className="h-12 rounded-xl"
                      id="operator_name"
                      value={formState.operator_name}
                      onChange={event =>
                        onFieldChange('operator_name', event.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      className="h-12 rounded-xl"
                      id="email"
                      type="email"
                      value={formState.email}
                      onChange={event =>
                        onFieldChange('email', event.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone_number">Phone Number</Label>
                    <PhoneInput
                      country="in"
                      value={`${(formState.country_code || '').replace(
                        '+',
                        '',
                      )}${formState.phone_number || ''}`}
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
                      inputClass="!h-12 !w-full !rounded-xl !border !border-input !bg-background !pl-[56px] !text-base !text-foreground !placeholder:text-muted-foreground"
                      buttonClass="!rounded-l-xl !border !border-input !bg-background"
                      dropdownClass="!rounded-xl !shadow-lg"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="gst_number">GST Number</Label>
                    <Input
                      className="h-12 rounded-xl"
                      id="gst_number"
                      value={formState.gst_number}
                      onChange={event =>
                        onFieldChange('gst_number', event.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2 2xl:col-span-3">
                    <Label htmlFor="logo">Logo URL</Label>
                    <Input
                      className="h-12 rounded-xl"
                      id="logo"
                      value={formState.logo}
                      onChange={event =>
                        onFieldChange('logo', event.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2 2xl:col-span-3">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      className="h-12 rounded-xl"
                      id="address"
                      value={formState.address}
                      onChange={event =>
                        onFieldChange('address', event.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2 2xl:col-span-3">
                    <Label htmlFor="driver_photo_upload_details">
                      Driver Photo
                    </Label>
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
                          document
                            .getElementById('driver_photo_upload_details')
                            ?.click()
                        }
                        disabled={isDriverPhotoUploading || isUpdating}
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
                        id="driver_photo_upload_details"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={event => void onDriverPhotoChange(event)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2 2xl:col-span-3">
                    <Label htmlFor="driving_license_upload_details">
                      Driving License
                    </Label>
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
                          {selectedLicenseName ||
                            'Upload driving license image'}
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
                          document
                            .getElementById('driving_license_upload_details')
                            ?.click()
                        }
                        disabled={isLicenseUploading || isUpdating}
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
                        id="driving_license_upload_details"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={event => void onDrivingLicenseChange(event)}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#f2fbff] p-4">
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
                    disabled={isUpdating}
                    className={`${detailActionButtonBase} min-w-[220px] bg-[#0077b6] text-white hover:bg-[#036aa0] focus-visible:ring-[#0077b6]/50`}
                  >
                    <Save className="mr-2 size-4" />
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </section>
          </main>
        </div>
      </div>
      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={open => {
          if (!isDeleting) {
            setIsDeleteDialogOpen(open);
          }
        }}
        title="Delete this operator?"
        description="This will permanently remove the operator and cannot be undone."
        confirmText="Delete operator"
        cancelText="Keep operator"
        onConfirm={() => void onDelete()}
        isConfirming={isDeleting}
      />
    </>
  );
}
