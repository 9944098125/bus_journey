import React from 'react';
import { UploadCloud, X } from 'lucide-react';

import { Button } from '../../../components/ui/button';
import Label from '../../../components/ui/label';
import { Skeleton } from '../../../components/ui/skeleton';

interface BusPhotosFieldProps {
  photos: string[];
  isUploading: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (index: number) => void;
}

export function BusPhotosField({
  photos,
  isUploading,
  onChange,
  onRemove,
}: BusPhotosFieldProps) {
  return (
    <div className="space-y-2">
      <Label>Bus Photos</Label>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            className="h-12 border-slate-200 bg-white px-6 text-base text-slate-700 hover:bg-slate-50"
            onClick={() =>
              document.getElementById('bus_photos_upload')?.click()
            }
          >
            <UploadCloud className="mr-2 h-5 w-5" />
            Upload Photos
          </Button>
          <input
            id="bus_photos_upload"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={onChange}
          />
          <span className="text-sm text-slate-500">
            {photos.length || 0} photo(s) selected
          </span>
        </div>
        {photos.length > 0 || isUploading ? (
          <div className="flex flex-wrap gap-2">
            {photos.map((photoUrl, pIndex) => (
              <div key={pIndex} className="group relative">
                <img
                  src={photoUrl}
                  alt={`Bus Photo ${pIndex}`}
                  className="h-16 w-16 rounded-md border border-slate-200 object-cover"
                />
                <button
                  type="button"
                  onClick={() => onRemove(pIndex)}
                  className="absolute -right-2 -top-2 hidden h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-white shadow-sm group-hover:flex"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {isUploading && <Skeleton className="h-16 w-16 rounded-md" />}
          </div>
        ) : null}
      </div>
    </div>
  );
}
