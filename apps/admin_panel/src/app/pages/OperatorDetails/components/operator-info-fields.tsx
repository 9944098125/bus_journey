import React from 'react';
import PhoneInput from 'react-phone-input-2';
import type { CountryData } from 'react-phone-input-2';

import { Input } from 'app/components/ui/input';
import Label from 'app/components/ui/label';
import type { OperatorPayload } from 'types/operator';
import {
  detailFieldControlClass,
  detailPhoneInputClass,
} from './operator-constants';

interface OperatorInfoFieldsProps {
  formState: OperatorPayload;
  onFieldChange: (
    field: keyof OperatorPayload,
    value: string | boolean,
  ) => void;
  onPhoneChange: (phone: string, country: CountryData | {}) => void;
}

export function OperatorInfoFields({
  formState,
  onFieldChange,
  onPhoneChange,
}: OperatorInfoFieldsProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3 2xl:gap-6">
      <div className="space-y-1.5">
        <Label htmlFor="operator_name">Operator Name</Label>
        <Input
          className={detailFieldControlClass}
          id="operator_name"
          value={formState.operator_name}
          onChange={event => onFieldChange('operator_name', event.target.value)}
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          className={detailFieldControlClass}
          id="email"
          type="email"
          value={formState.email}
          onChange={event => onFieldChange('email', event.target.value)}
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="phone_number">Phone Number</Label>
        <PhoneInput
          country="in"
          value={`${(formState.country_code || '').replace('+', '')}${
            formState.phone_number || ''
          }`}
          onChange={(phone, country) => onPhoneChange(phone, country)}
          inputProps={{
            id: 'phone_number',
            name: 'phone_number',
            required: true,
          }}
          containerClass="register-phone-input w-full"
          inputClass={detailPhoneInputClass}
          buttonClass="!rounded-l-xl !border !border-input !bg-background"
          dropdownClass="!rounded-xl !shadow-lg"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="gst_number">GST Number</Label>
        <Input
          className={detailFieldControlClass}
          id="gst_number"
          value={formState.gst_number}
          onChange={event => onFieldChange('gst_number', event.target.value)}
        />
      </div>
      <div className="space-y-1.5 md:col-span-2 2xl:col-span-3">
        <Label htmlFor="logo">Logo URL</Label>
        <Input
          className={detailFieldControlClass}
          id="logo"
          value={formState.logo}
          onChange={event => onFieldChange('logo', event.target.value)}
        />
      </div>
      <div className="space-y-1.5 md:col-span-2 2xl:col-span-3">
        <Label htmlFor="address">Address</Label>
        <Input
          className={detailFieldControlClass}
          id="address"
          value={formState.address}
          onChange={event => onFieldChange('address', event.target.value)}
        />
      </div>
    </div>
  );
}
