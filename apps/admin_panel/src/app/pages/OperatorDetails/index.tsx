import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

import { Button } from 'app/components/ui/button';
import { ConfirmationDialog } from 'app/components/ui/confirmation-dialog';
import { useOperatorsSlice } from 'app/pages/Operators/slice';
import 'react-phone-input-2/lib/style.css';

import { useOperatorDetails } from './components/use-operator-details';
import { OperatorSidebar } from './components/operator-sidebar';
import { OperatorDetailHeader } from './components/operator-detail-header';
import { OperatorDetailsForm } from './components/operator-details-form';

export function OperatorDetails() {
  useOperatorsSlice();
  const details = useOperatorDetails();
  const { operator, formState } = details;

  if (details.isLoading) {
    return (
      <div className="rounded-3xl border border-dashed bg-white/70 p-8 text-center">
        Loading operator details...
      </div>
    );
  }

  if (details.isError || !operator) {
    return (
      <div className="space-y-4 rounded-3xl border bg-white p-8 text-center">
        <p className="text-sm text-slate-600">
          Unable to load this operator. It may have been removed.
        </p>
        <Button asChild>
          <Link to="/operators">Back to Operators</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{operator.operator_name}</title>
        <meta name="description" content="View and manage a single operator." />
      </Helmet>

      <div className="mx-auto w-full max-w-[1800px] space-y-6 px-4 2xl:px-6">
        <div className="grid gap-6 lg:grid-cols-5 2xl:gap-8">
          <OperatorSidebar
            logo={operator.logo}
            operatorName={operator.operator_name}
            buses={formState.buses || []}
            isFetchingBuses={details.isFetchingBuses}
          />

          <main className="space-y-5 lg:col-span-4">
            <OperatorDetailHeader
              operatorName={operator.operator_name}
              createdAt={operator.createdAt}
              isActive={operator.is_active}
              isDeleting={details.isDeleting}
              onRequestDelete={() => details.setIsDeleteDialogOpen(true)}
            />

            <OperatorDetailsForm
              formState={formState}
              isFetchingBuses={details.isFetchingBuses}
              isUpdating={details.isUpdating}
              onUpdate={details.onUpdate}
              onFieldChange={details.onFieldChange}
              onPhoneChange={details.onPhoneChange}
              addBus={details.addBus}
              removeBus={details.removeBus}
              onBusFieldChange={details.onBusFieldChange}
              onBusPhotosChange={details.onBusPhotosChange}
              onBusDriverPhotoChange={details.onBusDriverPhotoChange}
              onBusDrivingLicenseChange={details.onBusDrivingLicenseChange}
              removeBusPhoto={details.removeBusPhoto}
            />
          </main>
        </div>
      </div>

      <ConfirmationDialog
        open={details.isDeleteDialogOpen}
        onOpenChange={open => {
          if (!details.isDeleting) details.setIsDeleteDialogOpen(open);
        }}
        title="Delete this operator?"
        description="This will permanently remove the operator and cannot be undone."
        confirmText="Delete operator"
        cancelText="Keep operator"
        onConfirm={() => void details.onDelete()}
        isConfirming={details.isDeleting}
      />
    </>
  );
}
