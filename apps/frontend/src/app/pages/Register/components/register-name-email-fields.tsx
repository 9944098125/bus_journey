import React from 'react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Mail, User } from 'lucide-react';

import { Input } from 'app/components/ui/input';
import Label from 'app/components/ui/label';
import ErrorMessage from 'app/components/ui/error-message';
import { cn } from 'utils/twm';
import type { RegisterFormValues } from 'types/user';

import { INPUT_CLASS } from './constants';

type RegisterNameEmailFieldsProps = {
  register: UseFormRegister<RegisterFormValues>;
  errors: FieldErrors<RegisterFormValues>;
};

export function RegisterNameEmailFields({
  register,
  errors,
}: RegisterNameEmailFieldsProps) {
  return (
    <>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="full_name">Full name *</Label>
        <div className="relative">
          <User className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#722f37]/50" />
          <Input
            id="full_name"
            placeholder="John Doe"
            className={cn(INPUT_CLASS, 'pl-11', errors.full_name && 'border-red-400')}
            {...register('full_name', {
              required: 'Full name is required',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters',
              },
              pattern: {
                value: /^[a-zA-Z\s.'-]+$/,
                message: 'Name contains invalid characters',
              },
            })}
          />
        </div>
        <ErrorMessage error={errors.full_name} />
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="email">Email address *</Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#722f37]/50" />
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={cn(INPUT_CLASS, 'pl-11', errors.email && 'border-red-400')}
            {...register('email', {
              required: 'Email is required',
              maxLength: {
                value: 30,
                message: 'Email cannot exceed 30 characters',
              },
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Enter a valid email address',
              },
            })}
          />
        </div>
        <ErrorMessage error={errors.email} />
      </div>
    </>
  );
}
