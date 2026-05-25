import React from 'react';
import { FieldErrors, UseFormRegister, UseFormWatch } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';

import { Input } from 'app/components/ui/input';
import Label from 'app/components/ui/label';
import ErrorMessage from 'app/components/ui/error-message';
import { cn } from 'utils/twm';
import type { RegisterFormValues } from 'types/user';

import { INPUT_CLASS } from './constants';

type RegisterPasswordFieldsProps = {
  register: UseFormRegister<RegisterFormValues>;
  errors: FieldErrors<RegisterFormValues>;
  watch: UseFormWatch<RegisterFormValues>;
  showPassword: boolean;
  showConfirmPassword: boolean;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
};

export function RegisterPasswordFields({
  register,
  errors,
  watch,
  showPassword,
  showConfirmPassword,
  onTogglePassword,
  onToggleConfirmPassword,
}: RegisterPasswordFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="password">Password *</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="••••••••"
            className={cn(
              INPUT_CLASS,
              'pr-11',
              errors.password && 'border-red-400',
            )}
            {...register('password', {
              required: 'Password is required',
              maxLength: {
                value: 12,
                message: 'Password cannot exceed 12 characters',
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

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm password *</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="••••••••"
            className={cn(
              INPUT_CLASS,
              'pr-11',
              errors.confirmPassword && 'border-red-400',
            )}
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: value =>
                value === watch('password') || 'Passwords do not match',
            })}
          />
          <button
            type="button"
            onClick={onToggleConfirmPassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#722f37]/60 hover:text-[#722f37]"
            aria-label={
              showConfirmPassword ? 'Hide password' : 'Show password'
            }
          >
            {showConfirmPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
        <ErrorMessage error={errors.confirmPassword} />
      </div>
    </>
  );
}
