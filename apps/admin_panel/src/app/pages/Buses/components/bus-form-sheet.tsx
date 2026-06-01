import React from 'react';
import { FileBadge2, ImagePlus, X } from 'lucide-react';

import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import Label from '../../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '../../../components/ui/sheet';
import { Bus } from '../slice/types';
import { useBusForm } from './use-bus-form';
import { BusUploadField } from './bus-upload-field';
import { BusPhotosField } from './bus-photos-field';

const actionButtonBase =
  'h-12 rounded-xl px-5 text-sm font-semibold transition-all duration-200 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-offset-2';

interface BusFormSheetProps {
  open: boolean;
  editingBus: Bus | null;
  onClose: () => void;
}

export function BusFormSheet({ open, editingBus, onClose }: BusFormSheetProps) {
  const form = useBusForm({ editingBus, open, onClose });
  const { formData, setFormData } = form;
  const busy = form.isCreating || form.isUpdating;

  return (
    <Sheet open={open} onOpenChange={next => !next && onClose()}>
      <SheetContent
        side="right"
        className="w-[400px] overflow-y-auto sm:w-[540px]"
        onPointerDownOutside={e => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>{editingBus ? 'Edit Bus' : 'Add New Bus'}</SheetTitle>
        </SheetHeader>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          onClick={onClose}
          aria-label="Close bus form"
          title="Close"
        >
          <X className="h-5 w-5" />
        </Button>
        <form onSubmit={form.handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bus_name">Bus Name</Label>
            <Input
              id="bus_name"
              required
              value={formData.bus_name}
              onChange={e =>
                setFormData({ ...formData, bus_name: e.target.value })
              }
              placeholder="e.g. SRS Travels Express"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bus_number">Bus Number</Label>
            <Input
              id="bus_number"
              required
              value={formData.bus_number}
              onChange={e =>
                setFormData({ ...formData, bus_number: e.target.value })
              }
              placeholder="e.g. KA 01 AB 1234"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bus_type">Bus Type</Label>
            <Select
              value={formData.bus_type}
              onValueChange={val => setFormData({ ...formData, bus_type: val })}
              required
            >
              <SelectTrigger id="bus_type" className="h-[5rem]">
                <SelectValue placeholder="Select Bus Type" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="semi sleeper">Semi Sleeper</SelectItem>
                <SelectItem value="sleeper">Sleeper</SelectItem>
                <SelectItem value="mini bus">Mini Bus</SelectItem>
                <SelectItem value="tour bus/charter">
                  Tour Bus / Charter
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="total_seats">Total Seats</Label>
            <Select
              value={formData.total_seats?.toString()}
              onValueChange={val =>
                setFormData({ ...formData, total_seats: val })
              }
              required
            >
              <SelectTrigger id="total_seats" className="h-[5rem]">
                <SelectValue placeholder="Select Total Seats" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="25 seats">25 seats</SelectItem>
                <SelectItem value="50 seats">50 seats</SelectItem>
                <SelectItem value="15 bearths up & down">
                  15 bearths up & down
                </SelectItem>
                <SelectItem value="25 bearths up & down">
                  25 bearths up & down
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amenities">Amenities (comma separated)</Label>
            <Input
              id="amenities"
              value={formData.amenities}
              onChange={e =>
                setFormData({ ...formData, amenities: e.target.value })
              }
              placeholder="e.g. WiFi, Water Bottle, Blanket"
            />
          </div>

          <BusUploadField
            id="driver_photo_upload"
            label="Driver Photo"
            value={formData.driver_photo}
            fileName={form.selectedDriverPhotoName}
            error={form.driverPhotoUploadError}
            uploading={form.isDriverPhotoUploading}
            disabled={busy}
            buttonText="Choose Driver Photo"
            buttonClass="border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100"
            previewClass="h-40 w-40"
            placeholderIcon={ImagePlus}
            onChange={form.onDriverPhotoChange}
            onRemove={() => setFormData({ ...formData, driver_photo: '' })}
          />

          <BusUploadField
            id="driving_license_upload"
            label="Driving License"
            value={formData.driving_license}
            fileName={form.selectedLicenseName}
            error={form.licenseUploadError}
            uploading={form.isLicenseUploading}
            disabled={busy}
            buttonText="Choose Driving License"
            buttonClass="border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
            previewClass="size-24"
            placeholderIcon={FileBadge2}
            onChange={form.onDrivingLicenseChange}
            onRemove={() => setFormData({ ...formData, driving_license: '' })}
          />

          <BusPhotosField
            photos={formData.photos ?? []}
            isUploading={form.isUploadingPhotos}
            onChange={form.onBusPhotosChange}
            onRemove={form.removeBusPhoto}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className={`${actionButtonBase} border-slate-200 text-slate-700 hover:bg-slate-50 focus-visible:ring-slate-300`}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className={`${actionButtonBase} bg-[#0077b6] text-white hover:-translate-y-0.5 hover:bg-[#036aa0] focus-visible:ring-[#0077b6]/50`}
              disabled={busy}
            >
              {busy ? 'Saving...' : 'Save Bus'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
