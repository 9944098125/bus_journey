import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import {
  BadgeCheck,
  Building2,
  CheckCircle2,
  CircleSlash,
  Pencil,
  Tag,
  Trash2,
  Users,
  X,
} from 'lucide-react';

import { cn } from 'utils/twm';
import { totalSeatsToSelectValue } from 'utils/busSeats';
import { Button } from '../../../components/ui/button';
import { Bus } from '../slice/types';
import { BusImageSlider } from './bus-image-slider';
import { DetailTile, DocumentTile } from './bus-detail-tiles';

interface BusDetailsDialogProps {
  bus: Bus | null;
  lightboxOpen: boolean;
  onClose: () => void;
  onOpenImages: (images: string[]) => void;
  onOpenSingleImage: (src: string) => void;
  onCloseLightbox: () => void;
  onEdit: (bus: Bus) => void;
  onDelete: (id: string) => void;
}

export function BusDetailsDialog({
  bus,
  lightboxOpen,
  onClose,
  onOpenImages,
  onOpenSingleImage,
  onCloseLightbox,
  onEdit,
  onDelete,
}: BusDetailsDialogProps) {
  return (
    <DialogPrimitive.Root
      open={!!bus}
      onOpenChange={open => !open && onClose()}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[90] bg-black/45 backdrop-blur-[2px] data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className="fixed left-1/2 top-1/2 z-[100] flex max-h-[92vh] w-[calc(100%-2rem)] max-w-[760px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-3xl border border-white/60 bg-white shadow-2xl outline-none data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          onPointerDownOutside={e => lightboxOpen && e.preventDefault()}
          onInteractOutside={e => lightboxOpen && e.preventDefault()}
          onEscapeKeyDown={e => {
            if (lightboxOpen) {
              e.preventDefault();
              onCloseLightbox();
            }
          }}
        >
          {bus && (
            <>
              <DialogPrimitive.Title className="sr-only">
                {bus.bus_name} details
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="sr-only">
                Detailed information for {bus.bus_name} ({bus.bus_number}).
              </DialogPrimitive.Description>

              <DialogPrimitive.Close
                className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
                aria-label="Close details"
              >
                <X className="h-5 w-5" />
              </DialogPrimitive.Close>

              <div className="overflow-y-auto">
                <BusImageSlider
                  images={bus.photos ?? []}
                  busName={bus.bus_name}
                  isActive={bus.is_active}
                  heightClass="h-72"
                  autoPlay
                  autoPlayIntervalMs={3000}
                  onImageClick={() =>
                    bus.photos?.length && onOpenImages(bus.photos)
                  }
                />

                <div className="space-y-6 p-7">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-bold text-[#023047]">
                        {bus.bus_name}
                      </h2>
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1',
                          bus.is_active
                            ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                            : 'bg-slate-100 text-slate-500 ring-slate-200',
                        )}
                      >
                        {bus.is_active ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : (
                          <CircleSlash className="h-3.5 w-3.5" />
                        )}
                        {bus.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="mt-2 inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 font-mono text-sm font-medium text-slate-600">
                      {bus.bus_number}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <DocumentTile
                      label="Driver Photo"
                      src={bus.driver_photo}
                      onOpen={() =>
                        bus.driver_photo && onOpenSingleImage(bus.driver_photo)
                      }
                    />
                    <DocumentTile
                      label="Driving License"
                      src={bus.driving_license}
                      onOpen={() =>
                        bus.driving_license &&
                        onOpenSingleImage(bus.driving_license)
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <DetailTile
                      icon={Tag}
                      label="Bus Type"
                      value={bus.bus_type}
                    />
                    <DetailTile
                      icon={Users}
                      label="Seats / Layout"
                      value={totalSeatsToSelectValue(bus.total_seats)}
                    />
                    <DetailTile
                      icon={Building2}
                      label="Operator"
                      value={bus.operator?.operator_name || 'Unassigned'}
                    />
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
                      Amenities
                    </p>
                    {bus.amenities && bus.amenities.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {bus.amenities.map((amenity, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 text-sm font-medium text-sky-700 ring-1 ring-sky-200"
                          >
                            <BadgeCheck className="h-3.5 w-3.5" />
                            {amenity}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400">
                        No amenities listed.
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
                    <p className="text-xs text-slate-400">
                      Added {new Date(bus.createdAt).toLocaleDateString()} ·
                      Updated {new Date(bus.updatedAt).toLocaleDateString()}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="h-11 rounded-xl border-[#1e3a8a]/30 px-5 font-semibold text-[#1e3a8a] hover:bg-[#1e3a8a]/5"
                        onClick={() => onEdit(bus)}
                      >
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </Button>
                      <Button
                        variant="outline"
                        className="h-11 rounded-xl border-rose-200 px-5 font-semibold text-rose-700 hover:bg-rose-50"
                        onClick={() => onDelete(bus._id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
