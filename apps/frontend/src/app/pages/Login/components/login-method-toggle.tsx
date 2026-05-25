import React from 'react';
import { Mail, Phone } from 'lucide-react';

import { cn } from 'utils/twm';
import type { LoginMethod } from 'types/user';

type LoginMethodToggleProps = {
  value: LoginMethod;
  onChange: (method: LoginMethod) => void;
};

export function LoginMethodToggle({ value, onChange }: LoginMethodToggleProps) {
  return (
    <div className="grid grid-cols-2 gap-2 rounded-2xl border border-[#e8d4d6] bg-[#faf0f0] p-1.5">
      <button
        type="button"
        onClick={() => onChange('email')}
        className={cn(
          'flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors',
          value === 'email'
            ? 'bg-white text-[#5c0a1a] shadow-sm'
            : 'text-[#722f37]/70 hover:text-[#722f37]',
        )}
      >
        <Mail className="size-4" />
        Email
      </button>
      <button
        type="button"
        onClick={() => onChange('phone')}
        className={cn(
          'flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors',
          value === 'phone'
            ? 'bg-white text-[#5c0a1a] shadow-sm'
            : 'text-[#722f37]/70 hover:text-[#722f37]',
        )}
      >
        <Phone className="size-4" />
        Phone
      </button>
    </div>
  );
}
