import React from 'react';
import type { CountryData } from 'react-phone-input-2';
import { Save } from 'lucide-react';

import { Button } from 'app/components/ui/button';
import Label from 'app/components/ui/label';
import { Switch } from 'app/components/ui/switch';
import { OperatorBusesFormSection } from 'app/pages/Operators/components/OperatorBusesFormSection';
import type { OperatorPayload } from 'types/operator';

import {
  detailActionButtonBase,
  detailFieldControlClass,
} from './operator-constants';
import { OperatorInfoFields } from './operator-info-fields';

interface OperatorDetailsFormProps {
  formState: OperatorPayload;
  isFetchingBuses: boolean;
  isUpdating: boolean;
  onUpdate: (event: React.FormEvent<HTMLFormElement>) => void;
  onFieldChange: (
    field: keyof OperatorPayload,
    value: string | boolean,
  ) => void;
  onPhoneChange: (phone: string, country: CountryData | {}) => void;
  addBus: () => void;
  removeBus: (index: number) => void;
  onBusFieldChange: (
    index: number,
    field: string,
    value: string | number,
  ) => void;
  onBusPhotosChange: (index: number, urls: string[]) => void;
  onBusDriverPhotoChange: (index: number, url: string) => void;
  onBusDrivingLicenseChange: (index: number, url: string) => void;
  removeBusPhoto: (busIndex: number, photoIndex: number) => void;
}

export function OperatorDetailsForm({
  formState,
  isFetchingBuses,
  isUpdating,
  onUpdate,
  onFieldChange,
  onPhoneChange,
  addBus,
  removeBus,
  onBusFieldChange,
  onBusPhotosChange,
  onBusDriverPhotoChange,
  onBusDrivingLicenseChange,
  removeBusPhoto,
}: OperatorDetailsFormProps) {
  return (
    <section className="rounded-3xl border border-white/60 bg-white p-8 shadow-sm 2xl:p-10">
      <h2 className="mb-4 text-xl font-semibold text-[#023047]">
        Update Operator Details
      </h2>
      <form onSubmit={onUpdate} className="space-y-4">
        <OperatorInfoFields
          formState={formState}
          onFieldChange={onFieldChange}
          onPhoneChange={onPhoneChange}
        />

        <OperatorBusesFormSection
          buses={formState.buses || []}
          isEditMode
          isLoadingBuses={isFetchingBuses}
          fieldControlClass={detailFieldControlClass}
          actionButtonBase={detailActionButtonBase}
          onAddBus={addBus}
          onRemoveBus={removeBus}
          onBusFieldChange={onBusFieldChange}
          onBusPhotosChange={onBusPhotosChange}
          onBusDriverPhotoChange={onBusDriverPhotoChange}
          onBusDrivingLicenseChange={onBusDrivingLicenseChange}
          removeBusPhoto={removeBusPhoto}
        />

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#f2fbff] p-4">
          <div className="flex items-center gap-3">
            <Switch
              id="is_active"
              checked={Boolean(formState.is_active)}
              onCheckedChange={checked => onFieldChange('is_active', checked)}
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
  );
}
