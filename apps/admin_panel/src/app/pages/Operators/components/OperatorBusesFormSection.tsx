import React, { useEffect, useRef, useState } from 'react';
import { FileBadge2, ImagePlus, Loader2, Plus, Trash2, UploadCloud, X } from 'lucide-react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from 'app/components/ui/accordion';
import { Skeleton } from 'app/components/ui/skeleton';
import { Button } from 'app/components/ui/button';
import { Input } from 'app/components/ui/input';
import Label from 'app/components/ui/label';
import { useToast } from 'app/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'app/components/ui/select';
import {
  useUploadBusPhotoMutation,
} from 'app/pages/Buses/slice';
import type { OperatorBusPayload } from 'types/operator';

type OperatorBusesFormSectionProps = {
  buses: OperatorBusPayload[];
  isEditMode?: boolean;
  isLoadingBuses?: boolean;
  fieldControlClass: string;
  actionButtonBase: string;
  onAddBus: () => void;
  onRemoveBus: (index: number) => void;
  onBusFieldChange: (index: number, field: string, value: string | number) => void;
  onBusPhotosChange: (index: number, urls: string[]) => void;
  onBusDriverPhotoChange?: (index: number, url: string) => void;
  onBusDrivingLicenseChange?: (index: number, url: string) => void;
  removeBusPhoto: (busIndex: number, photoIndex: number) => void;
};

const toErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error === 'string') {
    return error;
  }
  if (error && typeof error === 'object' && 'data' in error) {
    const maybeData = (error as { data?: { message?: string } }).data;
    if (maybeData?.message) {
      return maybeData.message;
    }
  }
  return fallback;
};

const validateImageFile = (file: File) => {
  if (!file.type.startsWith('image/')) {
    return 'Please upload a valid image file.';
  }
  if (file.size > 5 * 1024 * 1024) {
    return 'Image must be smaller than 5 MB.';
  }
  return '';
};

export function OperatorBusesFormSection({
  buses,
  isEditMode = false,
  isLoadingBuses = false,
  fieldControlClass,
  actionButtonBase,
  onAddBus,
  onRemoveBus,
  onBusFieldChange,
  onBusPhotosChange,
  removeBusPhoto,
}: OperatorBusesFormSectionProps) {
  const { toast } = useToast();
  const [uploadBusPhoto] = useUploadBusPhotoMutation();
  const [uploadingBusPhotosIndex, setUploadingBusPhotosIndex] = useState<number | null>(null);
  const [openBusItems, setOpenBusItems] = useState<string[]>([]);
  const previousBusCountRef = useRef(0);

  const getBusAccordionValue = (bus: OperatorBusPayload, index: number) =>
    bus._id || `new-bus-${index}`;

  useEffect(() => {
    const previousCount = previousBusCountRef.current;

    if (buses.length === previousCount + 1) {
      const newIndex = buses.length - 1;
      const newBus = buses[newIndex];
      if (!newBus._id) {
        const newValue = getBusAccordionValue(newBus, newIndex);
        setOpenBusItems(prev =>
          prev.includes(newValue) ? prev : [...prev, newValue],
        );
      }
    } else if (buses.length < previousCount) {
      setOpenBusItems(prev =>
        prev.filter(value =>
          buses.some((bus, index) => getBusAccordionValue(bus, index) === value),
        ),
      );
    }

    previousBusCountRef.current = buses.length;
  }, [buses]);

  const handleBusPhotosChange = async (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploadingBusPhotosIndex(index);
      const uploadPromises = Array.from(files).map(file => uploadBusPhoto(file).unwrap());
      const results = await Promise.all(uploadPromises);
      const imageUrls = results.map(res => res.imageUrl);
      const existingPhotos = buses[index]?.photos || [];
      onBusPhotosChange(index, [...existingPhotos, ...imageUrls]);
      toast({ title: 'Photos uploaded successfully' });
    } catch {
      toast({ title: 'Error uploading photos', variant: 'error' });
    } finally {
      setUploadingBusPhotosIndex(null);
    }
  };



  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800">
            Buses
            <span className="rounded-full bg-[#0077b6]/10 px-2.5 py-0.5 text-xs font-semibold text-[#0077b6]">
              {buses.length}
            </span>
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {isEditMode
              ? 'Existing buses are prefilled. Use Add Bus to register more buses for this operator.'
              : 'Add buses to this operator directly.'}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          className={`${actionButtonBase} shrink-0 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus-visible:ring-slate-300`}
          onClick={onAddBus}
        >
          <Plus className="mr-2 size-4" />
          Add Bus
        </Button>
      </div>

      {isLoadingBuses ? (
        <p className="text-sm text-slate-500">Loading existing buses...</p>
      ) : buses.length > 0 ? (
        <Accordion
          type="multiple"
          value={openBusItems}
          onValueChange={setOpenBusItems}
          className="rounded-lg border border-slate-200 bg-white px-4"
        >
          {buses.map((bus, index) => {
            const accordionValue = getBusAccordionValue(bus, index);
            const busLabel =
              bus.bus_name?.trim() ||
              (bus._id ? `Bus #${index + 1}` : `New bus #${index + 1}`);

            return (
              <AccordionItem key={accordionValue} value={accordionValue}>
                <AccordionTrigger className="py-5 pr-12 text-base hover:no-underline [&>svg]:size-7">
                  <span className="flex flex-col items-start gap-0.5 text-left sm:flex-row sm:items-center sm:gap-2">
                    <span className="font-semibold text-slate-800">{busLabel}</span>
                    {bus.bus_number ? (
                      <span className="text-xs font-normal text-slate-500">
                        {bus.bus_number}
                      </span>
                    ) : null}
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                        bus._id
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-sky-100 text-sky-700'
                      }`}
                    >
                      {bus._id ? 'Existing' : 'New'}
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="relative rounded-lg border border-slate-100 bg-slate-50/50 p-4">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2 h-8 w-8 text-rose-500 hover:bg-rose-50 hover:text-rose-600"
                      onClick={() => onRemoveBus(index)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                    <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor={`bus_name_${index}`}>Bus Name</Label>
                  <Input
                    id={`bus_name_${index}`}
                    className={fieldControlClass}
                    value={bus.bus_name}
                    onChange={e => onBusFieldChange(index, 'bus_name', e.target.value)}
                    placeholder="e.g. SRS Travels Express"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`bus_number_${index}`}>Bus Number</Label>
                  <Input
                    id={`bus_number_${index}`}
                    className={fieldControlClass}
                    value={bus.bus_number}
                    onChange={e => onBusFieldChange(index, 'bus_number', e.target.value)}
                    placeholder="e.g. KA 01 AB 1234"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`bus_type_${index}`}>Bus Type</Label>
                  <Select
                    value={bus.bus_type}
                    onValueChange={val => onBusFieldChange(index, 'bus_type', val)}
                    required
                  >
                    <SelectTrigger id={`bus_type_${index}`} className={fieldControlClass}>
                      <SelectValue placeholder="Select Bus Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="semi sleeper">Semi Sleeper</SelectItem>
                      <SelectItem value="sleeper">Sleeper</SelectItem>
                      <SelectItem value="mini bus">Mini Bus</SelectItem>
                      <SelectItem value="tour bus/charter">Tour Bus / Charter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`total_seats_${index}`}>Total Seats</Label>
                  <Select
                    value={bus.total_seats?.toString()}
                    onValueChange={val => onBusFieldChange(index, 'total_seats', val)}
                    required
                  >
                    <SelectTrigger id={`total_seats_${index}`} className={fieldControlClass}>
                      <SelectValue placeholder="Select Total Seats" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="25 seats">25 seats</SelectItem>
                      <SelectItem value="50 seats">50 seats</SelectItem>
                      <SelectItem value="15 bearths up & down">
                        15 bearths up &amp; down
                      </SelectItem>
                      <SelectItem value="25 bearths up & down">
                        25 bearths up &amp; down
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor={`amenities_${index}`}>Amenities (comma separated)</Label>
                  <Input
                    id={`amenities_${index}`}
                    className={fieldControlClass}
                    value={bus.amenities}
                    onChange={e => onBusFieldChange(index, 'amenities', e.target.value)}
                    placeholder="e.g. WiFi, Water Bottle, Blanket"
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor={`source_location_${index}`}>Source Location</Label>
                  <Input
                    id={`source_location_${index}`}
                    className={fieldControlClass}
                    value={bus.source_location}
                    onChange={e => onBusFieldChange(index, 'source_location', e.target.value)}
                    placeholder="e.g. Kakinada"
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <Label>Bus Photos</Label>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-12 border-slate-200 bg-white px-6 text-base text-slate-700 hover:bg-slate-50"
                        onClick={() => document.getElementById(`bus_photos_${index}`)?.click()}
                      >
                        <UploadCloud className="mr-2 h-5 w-5" />
                        Upload Photos
                      </Button>
                      <input
                        id={`bus_photos_${index}`}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={e => void handleBusPhotosChange(index, e)}
                      />
                      <span className="text-sm text-slate-500">
                        {bus.photos?.length || 0} photo(s) selected
                      </span>
                    </div>
                    {(bus.photos && bus.photos.length > 0) || uploadingBusPhotosIndex === index ? (
                      <div className="flex flex-wrap gap-2">
                        {bus.photos?.map((photoUrl, pIndex) => (
                          <div key={pIndex} className="group relative">
                            <img
                              src={photoUrl}
                              alt={`Bus ${index} Photo ${pIndex}`}
                              className="h-16 w-16 rounded-md border border-slate-200 object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeBusPhoto(index, pIndex)}
                              className="absolute -right-2 -top-2 hidden h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-white shadow-sm group-hover:flex"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                        {uploadingBusPhotosIndex === index && (
                          <Skeleton className="h-16 w-16 rounded-md" />
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      ) : (
        !isLoadingBuses && (
          <p className="text-sm text-slate-500">
            No buses yet. Click &quot;Add Bus&quot; to add the first bus.
          </p>
        )
      )}
    </div>
  );
}
