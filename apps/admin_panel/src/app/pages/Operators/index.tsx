import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import type { CountryData } from 'react-phone-input-2';
import {
  Eye,
  Loader2,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from 'lucide-react';

import { Skeleton } from 'app/components/ui/skeleton';
import { OperatorBusesFormSection } from './components/OperatorBusesFormSection';
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
  useUpdateOperatorMutation,
} from './slice';
import { useGetBusesQuery } from '../Buses/slice';
import type { Operator, OperatorPayload } from 'types/operator';
import { selectValueToTotalSeats, totalSeatsToSelectValue } from 'utils/busSeats';
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
      buses: busesData?.data
        ? busesData.data.map(bus => ({
            _id: bus._id,
            bus_name: bus.bus_name,
            bus_number: bus.bus_number,
            bus_type: bus.bus_type,
            total_seats: totalSeatsToSelectValue(bus.total_seats),
            amenities: Array.isArray(bus.amenities)
              ? bus.amenities.join(', ')
              : bus.amenities || '',
            photos: bus.photos || [],
            source_location: bus.source_location || '',
          }))
        : [],
    });
  }, [editingOperator, busesData]);

  const onFieldChange = (
    field: keyof OperatorPayload,
    value: string | boolean,
  ) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  const onBusPhotosChange = (index: number, urls: string[]) => {
    setFormState(prev => {
      const updatedBuses = [...(prev.buses || [])];
      updatedBuses[index] = { ...updatedBuses[index], photos: urls };
      return { ...prev, buses: updatedBuses };
    });
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
          source_location: '',
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

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formState.buses || formState.buses.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'An operator must have at least one bus.',
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
        buses:
          formState.buses?.map(bus => ({
            ...bus,
            total_seats: selectValueToTotalSeats(bus.total_seats),
            amenities:
              typeof bus.amenities === 'string'
                ? bus.amenities.split(',').map(a => a.trim()).filter(Boolean)
                : bus.amenities,
            source_location: bus.source_location?.trim() || undefined,
          })) || [],
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

            <OperatorBusesFormSection
              buses={formState.buses || []}
              isEditMode={Boolean(editingId)}
              isLoadingBuses={Boolean(editingId && isFetchingBuses)}
              fieldControlClass={fieldControlClass}
              actionButtonBase={actionButtonBase}
              onAddBus={addBus}
              onRemoveBus={removeBus}
              onBusFieldChange={onBusFieldChange}
              onBusPhotosChange={onBusPhotosChange}
              removeBusPhoto={removeBusPhoto}
            />

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
