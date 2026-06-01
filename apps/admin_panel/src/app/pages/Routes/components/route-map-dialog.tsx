import * as DialogPrimitive from '@radix-ui/react-dialog';
import { ArrowRight, Loader2, MapPin, X } from 'lucide-react';
import React, { Suspense, useEffect, useState } from 'react';

import { Button } from '../../../components/ui/button';
import { cn } from 'utils/twm';

import { loadRouteMapData, RouteMapData } from './route-map-utils';

const RouteMapView = React.lazy(() => import('./route-map-view'));

interface RouteMapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  routeName: string;
  sourceCity: string;
  sourceState?: string;
  destinationCity: string;
  destinationState?: string;
}

export function RouteMapDialog({
  open,
  onOpenChange,
  routeName,
  sourceCity,
  sourceState,
  destinationCity,
  destinationState,
}: RouteMapDialogProps) {
  const [mapData, setMapData] = useState<RouteMapData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setMapData(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const loadMap = async () => {
      setIsLoading(true);
      setError(null);
      setMapData(null);

      try {
        const data = await loadRouteMapData(
          sourceCity,
          destinationCity,
          sourceState,
          destinationState,
        );
        if (!cancelled) {
          setMapData(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Failed to load route map',
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadMap();

    return () => {
      cancelled = true;
    };
  }, [
    open,
    sourceCity,
    sourceState,
    destinationCity,
    destinationState,
  ]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            'fixed inset-0 z-[90] bg-black/45 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          )}
        />
        <DialogPrimitive.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-[100] flex h-[80vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-3xl border border-white/60 bg-white shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          )}
        >
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
            <div>
              <DialogPrimitive.Title className="flex items-center gap-2 text-xl font-bold text-[#023047]">
                <MapPin className="h-5 w-5 text-[#0077b6]" />
                {routeName}
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                <span className="font-medium text-emerald-700">{sourceCity}</span>
                <ArrowRight className="h-4 w-4 text-slate-400" />
                <span className="font-medium text-rose-700">
                  {destinationCity}
                </span>
              </DialogPrimitive.Description>
            </div>
            <DialogPrimitive.Close asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 w-9 shrink-0 rounded-lg border-slate-200 p-0"
                aria-label="Close map"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogPrimitive.Close>
          </div>

          <div className="flex min-h-0 flex-1 flex-col p-6">
            {isLoading && (
              <div className="flex h-full min-h-0 flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500">
                <Loader2 className="h-8 w-8 animate-spin text-[#0077b6]" />
                <p className="text-sm font-medium">Loading route on map...</p>
              </div>
            )}

            {!isLoading && error && (
              <div className="flex h-full min-h-0 flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-6 text-center text-rose-700">
                <MapPin className="h-8 w-8" />
                <p className="text-sm font-medium">{error}</p>
                <p className="text-xs text-rose-600/80">
                  Check that source and destination city names are valid.
                </p>
              </div>
            )}

            {!isLoading && mapData && (
              <Suspense
                fallback={
                  <div className="flex h-full min-h-0 flex-1 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
                    <Loader2 className="h-8 w-8 animate-spin text-[#0077b6]" />
                  </div>
                }
              >
              <div className="flex h-full min-h-0 flex-1 flex-col">
                <RouteMapView mapData={mapData} />
              </div>
              </Suspense>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
