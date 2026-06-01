import React from 'react';
import type { OperatorBusPayload } from 'types/operator';

interface OperatorSidebarProps {
  logo?: string;
  operatorName: string;
  buses: OperatorBusPayload[];
  isFetchingBuses: boolean;
}

export function OperatorSidebar({
  logo,
  operatorName,
  buses,
  isFetchingBuses,
}: OperatorSidebarProps) {
  return (
    <aside className="lg:col-span-1">
      <div className="sticky top-4 space-y-4">
        <section className="rounded-3xl border border-white/60 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Operator Logo
          </h2>
          {logo ? (
            <img
              src={logo}
              alt={`${operatorName} logo`}
              className="h-64 w-full rounded-2xl border border-slate-100 bg-slate-50 object-contain p-3"
              loading="lazy"
            />
          ) : (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-3 text-center text-sm text-slate-500">
              No logo URL added
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-white/60 bg-white p-5 shadow-sm">
          <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Bus Documents
          </h2>
          <p className="mb-4 text-xs text-slate-500">
            Driver photo and driving license for each bus
          </p>
          {isFetchingBuses ? (
            <p className="text-sm text-slate-500">Loading bus documents...</p>
          ) : buses.length ? (
            <div className="space-y-5">
              {buses.map((bus, index) => (
                <article
                  key={bus._id || `bus-docs-${index}`}
                  className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4"
                >
                  <div className="border-b border-slate-200 pb-2">
                    <p className="text-sm font-semibold text-[#023047]">
                      {bus.bus_name || `Bus #${index + 1}`}
                    </p>
                    {bus.bus_number ? (
                      <p className="text-xs text-slate-500">{bus.bus_number}</p>
                    ) : null}
                  </div>
                  <div className="space-y-4">
                    <BusDocument
                      label="Driver Photo"
                      src={bus.driver_photo}
                      alt={`${bus.bus_name || `Bus ${index + 1}`} driver`}
                      emptyLabel="No driver photo uploaded"
                    />
                    <BusDocument
                      label="Driving License"
                      src={bus.driving_license}
                      alt={`${
                        bus.bus_name || `Bus ${index + 1}`
                      } driving license`}
                      emptyLabel="No driving license uploaded"
                    />
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              No buses found for this operator.
            </p>
          )}
        </section>
      </div>
    </aside>
  );
}

function BusDocument({
  label,
  src,
  alt,
  emptyLabel,
}: {
  label: string;
  src?: string;
  alt: string;
  emptyLabel: string;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      {src ? (
        <img
          src={src}
          alt={alt}
          className="h-40 w-full rounded-xl border border-slate-200 bg-white object-cover shadow-sm"
          loading="lazy"
        />
      ) : (
        <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-xs text-slate-400">
          {emptyLabel}
        </div>
      )}
    </div>
  );
}
