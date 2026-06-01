import React from 'react';
import { Loader2, Route as RouteIcon } from 'lucide-react';

import { Button } from '../../../components/ui/button';
import { RouteItem } from '../slice/types';
import { RouteRow } from './route-row';

interface RoutesTableProps {
  routes: RouteItem[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  isLoading?: boolean;
  expandedId: string | null;
  onToggleExpand: (id: string) => void;
  onEdit: (route: RouteItem) => void;
  onDelete: (id: string) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
}

const HEADERS = [
  'Route',
  'Path',
  'Distance',
  'Duration',
  'Base Fare',
  'Stops',
  'Status',
];

export function RoutesTable({
  routes,
  totalCount,
  currentPage,
  totalPages,
  pageSize,
  isLoading = false,
  expandedId,
  onToggleExpand,
  onEdit,
  onDelete,
  onPrevPage,
  onNextPage,
}: RoutesTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-slate-50">
            <tr>
              <th className="w-10 px-4 py-4" />
              {HEADERS.map(h => (
                <th key={h} className="px-6 py-4 font-medium text-slate-500">
                  {h}
                </th>
              ))}
              <th className="px-6 py-4 text-right font-medium text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={9} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <Loader2 className="h-8 w-8 animate-spin text-[#0077b6]" />
                    <p className="text-sm font-medium text-slate-500">
                      Loading routes...
                    </p>
                  </div>
                </td>
              </tr>
            ) : routes.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <RouteIcon className="h-10 w-10" />
                    <p className="text-base font-medium text-slate-500">
                      No routes found
                    </p>
                    <p className="text-sm">
                      Try adjusting your search or filters.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              routes.map(route => (
                <RouteRow
                  key={route._id}
                  route={route}
                  isExpanded={expandedId === route._id}
                  onToggleExpand={onToggleExpand}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {!isLoading && totalCount > 0 && (
        <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-6 py-4 sm:flex-row">
          <p className="text-sm text-slate-500">
            Showing{' '}
            <span className="font-medium text-slate-700">
              {(currentPage - 1) * pageSize + 1}–
              {Math.min(currentPage * pageSize, totalCount)}
            </span>{' '}
            of <span className="font-medium text-slate-700">{totalCount}</span>{' '}
            routes
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-10 rounded-lg border-slate-300 px-4 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              disabled={currentPage <= 1}
              onClick={onPrevPage}
            >
              Previous
            </Button>
            <span className="px-2 text-sm font-medium text-slate-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="h-10 rounded-lg border-slate-300 px-4 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              disabled={currentPage >= totalPages}
              onClick={onNextPage}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
