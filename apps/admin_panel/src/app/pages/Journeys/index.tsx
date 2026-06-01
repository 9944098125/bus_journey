import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { useToast } from '../../components/ui/use-toast';
import { ConfirmationDialog } from '../../components/ui/confirmation-dialog';
import useDebounce from 'utils/hooks/debounce-hook';
import { useBusesSlice } from '../Buses/slice';
import { useOperatorsSlice, useGetOperatorsQuery } from '../Operators/slice';
import { useRoutesSlice, useGetRoutesQuery } from '../Routes/slice';
import {
  useJourneysSlice,
  useGetJourneysQuery,
  useDeleteJourneyMutation,
} from './slice';
import { JourneyFilters, JourneyItem } from './slice/types';
import { JourneyFormSheet } from './components/journey-form-sheet';
import { JourneyStats } from './components/journey-stats';
import { JourneysHeader } from './components/journeys-header';
import { JourneysTable } from './components/journeys-table';
import { PAGE_SIZE } from './components/journey-utils';

const INITIAL_FILTERS: JourneyFilters = {
  lifecycle: 'all',
  active: 'all',
  route: '',
  operator: '',
  bus: '',
};

export function Journeys() {
  useJourneysSlice();
  useRoutesSlice();
  useBusesSlice();
  useOperatorsSlice();

  const { toast } = useToast();

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState<JourneyFilters>(INITIAL_FILTERS);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const debouncedSearchTerm = useDebounce(searchInput, 500);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm, filters]);

  const queryArg = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      search: debouncedSearchTerm || undefined,
      route: filters.route || undefined,
      operator: filters.operator || undefined,
      status:
        filters.lifecycle !== 'all' ? filters.lifecycle : undefined,
      is_active:
        filters.active === 'active'
          ? true
          : filters.active === 'inactive'
            ? false
            : undefined,
    }),
    [page, debouncedSearchTerm, filters],
  );

  const { data: journeysResponse, isLoading, isFetching } =
    useGetJourneysQuery(queryArg);

  const { data: routesResponse } = useGetRoutesQuery({ limit: 200 });
  const { data: operatorsResponse } = useGetOperatorsQuery(undefined);

  const journeys = journeysResponse?.data ?? [];
  const totalCount = journeysResponse?.total ?? 0;
  const totalPages = journeysResponse?.totalPages ?? 1;
  const currentPage = journeysResponse?.page ?? page;

  const [deleteJourney, { isLoading: isDeleting }] = useDeleteJourneyMutation();

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingJourney, setEditingJourney] = useState<JourneyItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openCreateSheet = () => {
    setEditingJourney(null);
    setIsSheetOpen(true);
  };

  const openEditSheet = (journey: JourneyItem) => {
    setEditingJourney(journey);
    setIsSheetOpen(true);
  };

  const closeSheet = () => {
    setIsSheetOpen(false);
    setEditingJourney(null);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteJourney(deleteId).unwrap();
      toast({
        title: 'Success',
        description: 'Journey deleted successfully',
        variant: 'success',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error || 'Failed to delete journey',
        variant: 'error',
      });
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <>
      <Helmet>
        <title>Journeys</title>
      </Helmet>

      <div className="flex flex-col gap-6 p-6">
        <JourneysHeader
          searchInput={searchInput}
          onSearchChange={setSearchInput}
          filters={filters}
          routes={routesResponse?.data ?? []}
          operators={operatorsResponse?.data ?? []}
          onApplyFilters={setFilters}
          onClearFilters={() => {
            setFilters(INITIAL_FILTERS);
            setSearchInput('');
          }}
          onAddJourney={openCreateSheet}
        />

        <JourneyStats journeys={journeys} totalJourneys={totalCount} />

        <JourneysTable
          journeys={journeys}
          totalCount={totalCount}
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={PAGE_SIZE}
          isLoading={isLoading || isFetching}
          expandedId={expandedId}
          onToggleExpand={id =>
            setExpandedId(prev => (prev === id ? null : id))
          }
          onEdit={openEditSheet}
          onDelete={setDeleteId}
          onPrevPage={() => setPage(p => Math.max(1, p - 1))}
          onNextPage={() => setPage(p => Math.min(totalPages, p + 1))}
        />
      </div>

      <JourneyFormSheet
        open={isSheetOpen}
        editingJourney={editingJourney}
        onClose={closeSheet}
      />

      <ConfirmationDialog
        open={!!deleteId}
        onOpenChange={open => !open && setDeleteId(null)}
        title="Delete Journey"
        description="Are you sure you want to delete this journey? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        isConfirming={isDeleting}
      />
    </>
  );
}
