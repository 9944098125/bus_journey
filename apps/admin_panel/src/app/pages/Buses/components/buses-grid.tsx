import React from 'react';
import { ImageOff } from 'lucide-react';

import { Skeleton } from '../../../components/ui/skeleton';
import { Bus } from '../slice/types';
import { BusCard } from './bus-card';

interface BusesGridProps {
  buses: Bus[];
  isLoading: boolean;
  onViewDetails: (bus: Bus) => void;
  onEdit: (bus: Bus) => void;
  onDelete: (id: string) => void;
  onImageClick: (images: string[]) => void;
}

export function BusesGrid({
  buses,
  isLoading,
  onViewDetails,
  onEdit,
  onDelete,
  onImageClick,
}: BusesGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <Skeleton className="h-64 w-full rounded-none" />
            <div className="space-y-3 p-6">
              <Skeleton className="h-7 w-4/5" />
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-11 flex-1 rounded-xl" />
                <Skeleton className="h-11 w-11 rounded-xl" />
                <Skeleton className="h-11 w-11 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (buses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-slate-400">
        <ImageOff className="h-12 w-12" />
        <p className="text-base font-medium text-slate-500">No buses found</p>
        <p className="text-sm">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {buses.map(bus => (
        <BusCard
          key={bus._id}
          bus={bus}
          onViewDetails={onViewDetails}
          onEdit={onEdit}
          onDelete={onDelete}
          onImageClick={onImageClick}
        />
      ))}
    </div>
  );
}
