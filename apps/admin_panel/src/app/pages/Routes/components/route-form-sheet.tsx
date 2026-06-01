import React from 'react';
import { Loader2, X } from 'lucide-react';

import { Button } from '../../../components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '../../../components/ui/sheet';
import { RouteItem } from '../slice/types';
import { useRouteForm } from './use-route-form';
import { RouteFormFields } from './route-form-fields';
import { RouteStopsSection } from './route-stops-section';

interface RouteFormSheetProps {
  open: boolean;
  editingRoute: RouteItem | null;
  onClose: () => void;
}

export function RouteFormSheet({
  open,
  editingRoute,
  onClose,
}: RouteFormSheetProps) {
  const {
    formData,
    setFormData,
    updateStop,
    addStop,
    removeStop,
    handleSubmit,
    isSubmitting,
  } = useRouteForm({ editingRoute, open, onClose });

  return (
    <Sheet open={open} onOpenChange={next => !next && onClose()}>
      <SheetContent
        side="right"
        className="w-[420px] overflow-y-auto sm:w-[620px]"
        onPointerDownOutside={e => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>
            {editingRoute ? 'Edit Route' : 'Add New Route'}
          </SheetTitle>
        </SheetHeader>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          onClick={onClose}
          aria-label="Close route form"
          title="Close"
        >
          <X className="h-5 w-5" />
        </Button>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <RouteFormFields formData={formData} setFormData={setFormData} />

          <RouteStopsSection
            stops={formData.stops}
            onAddStop={addStop}
            onUpdateStop={updateStop}
            onRemoveStop={removeStop}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="h-12 rounded-xl border-slate-200 px-5 font-semibold text-slate-700 hover:bg-slate-50"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 rounded-xl bg-[#0077b6] px-5 font-semibold text-white hover:-translate-y-0.5 hover:bg-[#036aa0] disabled:opacity-60"
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {editingRoute ? 'Save Changes' : 'Create Route'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
