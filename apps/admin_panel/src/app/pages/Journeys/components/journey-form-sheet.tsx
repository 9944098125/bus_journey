import React from 'react';
import { Loader2, X, ImagePlus, FileBadge2 } from 'lucide-react';

import { Button } from '../../../components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '../../../components/ui/sheet';
import { JourneyItem } from '../slice/types';
import { JourneyFormFields } from './journey-form-fields';
import { getJourneySeatsDisplay } from './journey-utils';
import { useJourneyForm } from './use-journey-form';
import { JourneyUploadField } from './journey-upload-field';

interface JourneyFormSheetProps {
  open: boolean;
  editingJourney: JourneyItem | null;
  onClose: () => void;
}

export function JourneyFormSheet({
  open,
  editingJourney,
  onClose,
}: JourneyFormSheetProps) {
  const form = useJourneyForm({ editingJourney, open, onClose });

  return (
    <Sheet open={open} onOpenChange={next => !next && onClose()}>
      <SheetContent
        side="right"
        className="w-[420px] overflow-y-auto sm:w-[580px]"
        onPointerDownOutside={e => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>
            {editingJourney ? 'Edit Journey' : 'Schedule New Journey'}
          </SheetTitle>
        </SheetHeader>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          onClick={onClose}
          aria-label="Close journey form"
          title="Close"
        >
          <X className="h-5 w-5" />
        </Button>

        <form onSubmit={form.handleSubmit} className="mt-6 space-y-5">
          <JourneyFormFields
            formData={form.formData}
            setFormData={form.setFormData}
            routes={form.routes}
            buses={form.buses}
            onRouteChange={form.onRouteChange}
            onBusChange={form.onBusChange}
            isEditing={!!editingJourney}
            seatsDisplay={
              editingJourney ? getJourneySeatsDisplay(editingJourney) : undefined
            }
          />

          <JourneyUploadField
            id="driver_photo_upload"
            label="Driver Photo"
            value={form.formData.driver_photo}
            fileName={form.selectedDriverPhotoName}
            error={form.driverPhotoUploadError}
            uploading={form.isDriverPhotoUploading}
            disabled={form.isSubmitting}
            buttonText="Choose Driver Photo"
            buttonClass="border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100"
            previewClass="h-40 w-40"
            placeholderIcon={ImagePlus}
            onChange={form.onDriverPhotoChange}
            onRemove={() => form.setFormData({ ...form.formData, driver_photo: '' })}
          />

          <JourneyUploadField
            id="driving_license_upload"
            label="Driving License"
            value={form.formData.driving_license}
            fileName={form.selectedLicenseName}
            error={form.licenseUploadError}
            uploading={form.isLicenseUploading}
            disabled={form.isSubmitting}
            buttonText="Choose Driving License"
            buttonClass="border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
            previewClass="size-24"
            placeholderIcon={FileBadge2}
            onChange={form.onDrivingLicenseChange}
            onRemove={() => form.setFormData({ ...form.formData, driving_license: '' })}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="h-12 rounded-xl border-slate-200 px-5 font-semibold text-slate-700 hover:bg-slate-50"
              onClick={onClose}
              disabled={form.isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={form.isSubmitting}
              className="h-12 rounded-xl bg-[#0077b6] px-5 font-semibold text-white hover:-translate-y-0.5 hover:bg-[#036aa0] disabled:opacity-60"
            >
              {form.isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {editingJourney ? 'Save Changes' : 'Create Journey'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
