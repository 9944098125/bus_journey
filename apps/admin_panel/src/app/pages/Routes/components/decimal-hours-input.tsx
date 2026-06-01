import React from 'react';

import { Input } from '../../../components/ui/input';
import Label from '../../../components/ui/label';

interface DecimalHoursInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: React.ReactNode;
}

export function DecimalHoursInput({
  id,
  label,
  value,
  onChange,
  hint,
}: DecimalHoursInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        min={0}
        step="any"
        inputMode="decimal"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="e.g. 9 or 9.5"
      />
      {hint ?? (
        <p className="text-xs leading-snug text-slate-400">
          Enter hours only, or use a decimal for minutes —{' '}
          <span className="font-medium text-slate-500">9.5</span> means 9 hours
          30 minutes.
        </p>
      )}
    </div>
  );
}
