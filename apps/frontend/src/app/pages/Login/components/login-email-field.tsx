import React from 'react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Mail } from 'lucide-react';

import { Input } from 'app/components/ui/input';
import Label from 'app/components/ui/label';
import ErrorMessage from 'app/components/ui/error-message';
import { cn } from 'utils/twm';
import type { LoginFormValues } from 'types/user';

import { INPUT_CLASS } from './constants';

type LoginEmailFieldProps = {
  register: UseFormRegister<LoginFormValues>;
  errors: FieldErrors<LoginFormValues>;
  isActive: boolean;
};

export function LoginEmailField({
  register,
  errors,
  isActive,
}: LoginEmailFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="login-email">Email address *</Label>
      <div className="relative">
        <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#722f37]/50" />
        <Input
          id="login-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className={cn(INPUT_CLASS, 'pl-11', errors.email && 'border-red-400')}
          {...register('email', {
            maxLength: {
              value: 30,
              message: 'Email cannot exceed 30 characters',
            },
            validate: value => {
              if (!isActive) {
                return true;
              }
              if (!value?.trim()) {
                return 'Email is required';
              }
              if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                return 'Enter a valid email address';
              }
              return true;
            },
          })}
        />
      </div>
      <ErrorMessage error={errors.email} />
    </div>
  );
}
