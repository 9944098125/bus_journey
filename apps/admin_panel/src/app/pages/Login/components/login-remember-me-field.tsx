import React from 'react';
import { UseFormRegister } from 'react-hook-form';

import { cn } from 'utils/twm';
import type { LoginFormValues } from 'types/user';

type LoginRememberMeFieldProps = {
  register: UseFormRegister<LoginFormValues>;
};

export function LoginRememberMeField({ register }: LoginRememberMeFieldProps) {
  return (
    <div className="flex items-center gap-4 py-1">
      <input
        id="rememberMe"
        type="checkbox"
        className={cn(
          'size-8 shrink-0 cursor-pointer rounded-lg border-2 border-[#90e0ef] bg-[#f0f9ff] text-[#0077b6]',
          'accent-[#0077b6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0077b6]/35',
          'sm:size-9',
        )}
        {...register('rememberMe')}
      />
      <label
        htmlFor="rememberMe"
        className="cursor-pointer select-none text-[1.2rem] md:text-[1.6rem] font-medium text-[#023047]"
      >
        Remember Me
      </label>
    </div>
  );
}
