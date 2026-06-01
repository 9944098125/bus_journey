import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { useToast } from '../../components/ui/use-toast';
import { ConfirmationDialog } from '../../components/ui/confirmation-dialog';
import useDebounce from 'utils/hooks/debounce-hook';

import {
  useRoutesSlice,
  useGetRoutesQuery,
  useDeleteRouteMutation,
} from './slice';
import { RouteItem } from './slice/types';
import { PAGE_SIZE } from './components/route-utils';
import { RoutesHeader, RouteStatusFilter } from './components/routes-header';
import { RouteStats } from './components/route-stats';
import { RoutesTable } from './components/routes-table';
import { RouteFormSheet } from './components/route-form-sheet';
import { RouteMapDialog } from './components/route-map-dialog';

export function Routes() {
  useRoutesSlice();

  const { toast } = useToast();

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState<RouteStatusFilter>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const debouncedSearchTerm = useDebounce(searchInput, 500);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm, statusFilter]);

  const { data: routesResponse, isLoading, isFetching } = useGetRoutesQuery({
    page,
    limit: PAGE_SIZE,
    search: debouncedSearchTerm || undefined,
    status: statusFilter,
  });

  const routes = routesResponse?.data ?? [];
  const totalCount = routesResponse?.total ?? 0;
  const totalPages = routesResponse?.totalPages ?? 1;
  const currentPage = routesResponse?.page ?? page;

  const [deleteRoute, { isLoading: isDeleting }] = useDeleteRouteMutation();

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<RouteItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewRoute, setViewRoute] = useState<RouteItem | null>(null);

  const openCreateSheet = () => {
    setEditingRoute(null);
    setIsSheetOpen(true);
  };

  const openEditSheet = (route: RouteItem) => {
    setEditingRoute(route);
    setIsSheetOpen(true);
  };

  const closeSheet = () => {
    setIsSheetOpen(false);
    setEditingRoute(null);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteRoute(deleteId).unwrap();
      toast({
        title: 'Success',
        description: 'Route deleted successfully',
        variant: 'success',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error || 'Failed to delete route',
        variant: 'error',
      });
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <>
      <Helmet>
        <title>Routes</title>
      </Helmet>

      <div className="flex flex-col gap-6 p-6">
        <RoutesHeader
          searchInput={searchInput}
          onSearchChange={setSearchInput}
          statusFilter={statusFilter}
          onApplyStatus={setStatusFilter}
          onClearStatus={() => setStatusFilter('all')}
          onAddRoute={openCreateSheet}
        />

        <RouteStats routes={routes} totalRoutes={totalCount} />

        <RoutesTable
          routes={routes}
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
          onView={setViewRoute}
          onDelete={setDeleteId}
          onPrevPage={() => setPage(p => Math.max(1, p - 1))}
          onNextPage={() => setPage(p => Math.min(totalPages, p + 1))}
        />
      </div>

      <RouteFormSheet
        open={isSheetOpen}
        editingRoute={editingRoute}
        onClose={closeSheet}
      />

      <RouteMapDialog
        open={!!viewRoute}
        onOpenChange={open => !open && setViewRoute(null)}
        routeName={viewRoute?.route_name ?? ''}
        sourceCity={viewRoute?.source_city ?? ''}
        sourceState={viewRoute?.source_state}
        destinationCity={viewRoute?.destination_city ?? ''}
        destinationState={viewRoute?.destination_state}
      />

      <ConfirmationDialog
        open={!!deleteId}
        onOpenChange={open => !open && setDeleteId(null)}
        title="Delete Route"
        description="Are you sure you want to delete this route? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        isConfirming={isDeleting}
      />
    </>
  );
}
