import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';

import { Button } from 'app/components/ui/button';
import { detailActionButtonBase } from './operator-constants';

interface OperatorDetailHeaderProps {
  operatorName: string;
  createdAt: string;
  isActive: boolean;
  isDeleting: boolean;
  onRequestDelete: () => void;
}

export function OperatorDetailHeader({
  operatorName,
  createdAt,
  isActive,
  isDeleting,
  onRequestDelete,
}: OperatorDetailHeaderProps) {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          asChild
          variant="ghost"
          className={`${detailActionButtonBase} border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus-visible:ring-slate-300`}
        >
          <Link to="/operators">
            <ArrowLeft className="mr-2 size-4" />
            Back to Operators
          </Link>
        </Button>
        <Button
          type="button"
          variant="destructive"
          className={`${detailActionButtonBase} border border-rose-700 bg-rose-600 text-white shadow-sm hover:bg-rose-700 focus-visible:ring-rose-300`}
          onClick={onRequestDelete}
          disabled={isDeleting}
        >
          <Trash2 className="mr-2 size-4" />
          {isDeleting ? 'Deleting...' : 'Delete Operator'}
        </Button>
      </div>

      <section className="rounded-3xl border border-white/60 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="mb-1 text-3xl font-bold text-[#023047]">
              {operatorName}
            </h1>
            <p className="text-sm text-slate-500">
              Created at {new Date(createdAt).toLocaleString()}
            </p>
          </div>
          <span
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              isActive
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-rose-100 text-rose-700'
            }`}
          >
            {isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </section>
    </>
  );
}
