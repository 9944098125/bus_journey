import React from 'react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Eye, EyeOff, Lock } from 'lucide-react';

import { Input } from 'app/components/ui/input';
import Label from 'app/components/ui/label';
import ErrorMessage from 'app/components/ui/error-message';
import { cn } from 'utils/twm';
import type { LoginFormValues } from 'types/user';

import { INPUT_CLASS } from './constants';

type LoginPasswordFieldProps = {
  register: UseFormRegister<LoginFormValues>;
  errors: FieldErrors<LoginFormValues>;
  showPassword: boolean;
  onTogglePassword: () => void;
};

export function LoginPasswordField({
  register,
  errors,
  showPassword,
  onTogglePassword,
}: LoginPasswordFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="login-password">Password *</Label>
      <div className="relative">
        <Lock className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#722f37]/50" />
        <Input
          id="login-password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          placeholder="••••••••"
          className={cn(
            INPUT_CLASS,
            'pl-11 pr-11',
            errors.password && 'border-red-400',
          )}
          {...register('password', {
            required: 'Password is required',
            maxLength: {
              value: 25,
              message: 'Password cannot exceed 25 characters',
            },
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          })}
        />
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#722f37]/60 hover:text-[#722f37]"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
        </button>
      </div>
      <ErrorMessage error={errors.password} />
    </div>
  );
}
