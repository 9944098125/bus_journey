import React from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import PhoneInput from 'react-phone-input-2';
import type { CountryData } from 'react-phone-input-2';

import Label from 'app/components/ui/label';
import ErrorMessage from 'app/components/ui/error-message';
import { cn } from 'utils/twm';
import type { LoginFormValues } from 'types/user';

type LoginPhoneFieldProps = {
  control: Control<LoginFormValues>;
  errors: FieldErrors<LoginFormValues>;
  isActive: boolean;
  onCountryChange: (country: CountryData) => void;
};

export function LoginPhoneField({
  control,
  errors,
  isActive,
  onCountryChange,
}: LoginPhoneFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="login-phone">Phone number *</Label>
      <Controller
        name="phone"
        control={control}
        rules={{
          validate: value => {
            if (!isActive) {
              return true;
            }
            if (!value || value.length < 8) {
              return 'Enter a valid phone number';
            }
            return true;
          },
        }}
        render={({ field: { onChange, value } }) => (
          <PhoneInput
            country="in"
            value={value}
            onChange={(phone, country) => {
              onChange(phone);
              if (
                country &&
                typeof country === 'object' &&
                'dialCode' in country
              ) {
                onCountryChange(country as CountryData);
              }
            }}
            inputProps={{
              id: 'login-phone',
              name: 'phone',
              required: true,
            }}
            containerClass="register-phone-input w-full"
            inputClass={cn(
              '!h-20 !w-full !rounded-xl !border !border-[#90e0ef] !bg-[#f0f9ff] !pl-[56px] !text-[1.4rem] !text-[#023047] !placeholder:!text-[#7eb8d4] transition-shadow focus:!ring-2 focus:!ring-[#0077b6]/35',
              errors.phone && '!border-red-400',
            )}
            buttonClass="!rounded-l-xl !border !border-[#90e0ef] !bg-[#e8f6fc] hover:!bg-[#caf0f8]"
            dropdownClass="!rounded-xl !shadow-lg"
          />
        )}
      />
      <ErrorMessage error={errors.phone} />
    </div>
  );
}
