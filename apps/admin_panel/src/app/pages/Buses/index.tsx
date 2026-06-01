import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { useBusesSlice, useGetBusesQuery, useDeleteBusMutation } from './slice';
import { useOperatorsSlice } from '../Operators/slice';
import { Bus } from './slice/types';
import { useToast } from '../../components/ui/use-toast';
import { ConfirmationDialog } from '../../components/ui/confirmation-dialog';
import useDebounce from 'utils/hooks/debounce-hook';

import { BusesHeader, BusFilters } from './components/buses-header';
import { BusesGrid } from './components/buses-grid';
import { BusFormSheet } from './components/bus-form-sheet';
import { BusDetailsDialog } from './components/bus-details-dialog';
import { ImageLightbox } from './components/image-lightbox';
import { useImageLightbox } from './components/use-image-lightbox';

const INITIAL_LOAD_MS = 3000;

export function Buses() {
  useBusesSlice();
  useOperatorsSlice();

  const { toast } = useToast();
  const lightbox = useImageLightbox();

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoading(false), INITIAL_LOAD_MS);
    return () => clearTimeout(timer);
  }, []);

  const [page, setPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState<BusFilters>({
    seats: '',
    bus_type: '',
  });
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearchTerm = useDebounce(searchInput, 500);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm]);

  const { data: busesResponse, isLoading } = useGetBusesQuery({
    page,
    limit: 10,
    search: debouncedSearchTerm || undefined,
    seats: activeFilters.seats || undefined,
    bus_type: activeFilters.bus_type || undefined,
  });

  const [deleteBus, { isLoading: isDeleting }] = useDeleteBusMutation();

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingBus, setEditingBus] = useState<Bus | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [detailsBus, setDetailsBus] = useState<Bus | null>(null);

  const openSheet = (bus?: Bus) => {
    setEditingBus(bus ?? null);
    setIsSheetOpen(true);
  };

  const closeSheet = () => {
    setIsSheetOpen(false);
    setEditingBus(null);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteBus(deleteId).unwrap();
      toast({
        title: 'Success',
        description: 'Bus deleted successfully',
        variant: 'success',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error || 'Failed to delete bus',
        variant: 'error',
      });
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <>
      <Helmet>
        <title>Buses</title>
      </Helmet>

      <div className="flex flex-col gap-6 p-6">
        <BusesHeader
          searchInput={searchInput}
          onSearchChange={setSearchInput}
          activeFilters={activeFilters}
          onApply={filters => {
            setActiveFilters(filters);
            setPage(1);
          }}
          onClear={() => {
            setActiveFilters({ seats: '', bus_type: '' });
            setSearchInput('');
            setPage(1);
          }}
        />

        <BusesGrid
          buses={busesResponse?.data ?? []}
          isLoading={isLoading || isInitialLoading}
          onViewDetails={setDetailsBus}
          onEdit={openSheet}
          onDelete={setDeleteId}
          onImageClick={lightbox.openLightbox}
        />
      </div>

      <BusFormSheet
        open={isSheetOpen}
        editingBus={editingBus}
        onClose={closeSheet}
      />

      <ConfirmationDialog
        open={!!deleteId}
        onOpenChange={open => !open && setDeleteId(null)}
        title="Delete Bus"
        description="Are you sure you want to delete this bus? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        isConfirming={isDeleting}
      />

      <BusDetailsDialog
        bus={detailsBus}
        lightboxOpen={lightbox.lightboxOpen}
        onClose={() => setDetailsBus(null)}
        onOpenImages={lightbox.openLightbox}
        onOpenSingleImage={lightbox.openSingleImage}
        onCloseLightbox={lightbox.closeLightbox}
        onEdit={bus => {
          setDetailsBus(null);
          openSheet(bus);
        }}
        onDelete={id => {
          setDeleteId(id);
          setDetailsBus(null);
        }}
      />

      <ImageLightbox
        open={lightbox.lightboxOpen}
        images={lightbox.lightboxImages}
        currentIndex={lightbox.currentImageIndex}
        onClose={lightbox.closeLightbox}
        onPrev={lightbox.showPrev}
        onNext={lightbox.showNext}
      />
    </>
  );
}
