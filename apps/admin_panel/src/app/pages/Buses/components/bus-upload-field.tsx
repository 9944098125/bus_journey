import React from 'react';
import { Loader2, Trash2, UploadCloud } from 'lucide-react';

import { Button } from '../../../components/ui/button';
import Label from '../../../components/ui/label';

interface BusUploadFieldProps {
  id: string;
  label: string;
  value: string;
  fileName: string;
  error: string;
  uploading: boolean;
  disabled?: boolean;
  buttonText: string;
  buttonClass: string;
  previewClass: string;
  placeholderIcon: React.ComponentType<{ className?: string }>;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}

export function BusUploadField({
  id,
  label,
  value,
  fileName,
  error,
  uploading,
  disabled,
  buttonText,
  buttonClass,
  previewClass,
  placeholderIcon: PlaceholderIcon,
  onChange,
  onRemove,
}: BusUploadFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex flex-wrap items-center gap-4 rounded-2xl border bg-slate-50 p-4">
        <div
          className={`overflow-hidden rounded-2xl border bg-white shadow-sm ${previewClass}`}
        >
          {value ? (
            <img src={value} alt={label} className="size-full object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center text-slate-400">
              <PlaceholderIcon className="size-5" />
            </div>
          )}
        </div>
        <div className="min-w-[240px] flex-1 space-y-1">
          <p className="text-sm font-medium text-slate-700">
            {fileName || `Upload ${label.toLowerCase()}`}
          </p>
          <p className="text-xs text-slate-500">JPG, PNG, WEBP up to 5MB</p>
          {error && (
            <p className="text-xs font-medium text-rose-600">{error}</p>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          className={`h-12 min-w-[220px] rounded-xl shadow-sm ${buttonClass}`}
          onClick={() => document.getElementById(id)?.click()}
          disabled={uploading || disabled}
        >
          {uploading ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <UploadCloud className="mr-2 size-4" />
          )}
          {uploading ? 'Uploading...' : buttonText}
        </Button>
        {value && (
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-xl border-rose-200 text-rose-700 hover:bg-rose-50"
            onClick={onRemove}
          >
            <Trash2 className="mr-2 size-4" /> Remove
          </Button>
        )}
        <input
          id={id}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onChange}
        />
      </div>
    </div>
  );
}
