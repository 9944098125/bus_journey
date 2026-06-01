import React from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';

import { Button } from '../../../components/ui/button';
import { Bus } from '../slice/types';
import { BusImageSlider } from './bus-image-slider';

interface BusCardProps {
  bus: Bus;
  onViewDetails: (bus: Bus) => void;
  onEdit: (bus: Bus) => void;
  onDelete: (id: string) => void;
  onImageClick: (images: string[]) => void;
}

export function BusCard({
  bus,
  onViewDetails,
  onEdit,
  onDelete,
  onImageClick,
}: BusCardProps) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <BusImageSlider
        images={bus.photos ?? []}
        busName={bus.bus_name}
        isActive={bus.is_active}
        onImageClick={() => bus.photos?.length && onImageClick(bus.photos)}
      />
      <div className="flex flex-1 flex-col p-5">
        <h3
          className="truncate text-lg font-bold text-slate-900"
          title={bus.bus_name}
        >
          {bus.bus_name}
        </h3>
        <p className="mt-0.5 inline-flex w-fit items-center rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs font-medium text-slate-600">
          {bus.bus_number}
        </p>
        <div className="mt-4 flex items-center gap-2 pt-1">
          <Button
            className="h-11 flex-1 rounded-xl bg-[#0077b6] font-semibold text-white shadow-sm transition-all hover:bg-[#036aa0]"
            onClick={() => onViewDetails(bus)}
          >
            <Eye className="mr-2 h-4 w-4" /> View Details
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-11 w-11 shrink-0 rounded-xl border-[#1e3a8a]/70 bg-[#1e3a8a]/70 text-white shadow-sm hover:border-[#1e3a8a] hover:bg-[#1e3a8a] hover:text-white"
            onClick={() => onEdit(bus)}
            title="Edit bus"
            aria-label="Edit bus"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-11 w-11 shrink-0 rounded-xl border-[#991b1b]/70 bg-[#991b1b]/70 text-white shadow-sm hover:border-[#991b1b] hover:bg-[#991b1b] hover:text-white"
            onClick={() => onDelete(bus._id)}
            title="Delete bus"
            aria-label="Delete bus"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
