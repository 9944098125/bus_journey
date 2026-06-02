import type { CountryData } from 'react-phone-input-2';
import type { OperatorBusPayload, OperatorPayload } from 'types/operator';
import { selectValueToTotalSeats } from 'utils/busSeats';

export function validateOperatorBuses(
  buses: OperatorBusPayload[] | undefined,
): string | null {
  if (!buses || buses.length === 0) {
    return 'An operator must have at least one bus.';
  }
  return null;
}

export function buildOperatorPayload(
  formState: OperatorPayload,
  phoneCountry: CountryData,
): OperatorPayload {
  return {
    ...formState,
    operator_name: formState.operator_name.trim(),
    email: formState.email.trim(),
    country_code: formState.country_code.trim() || `+${phoneCountry.dialCode}`,
    phone_number: formState.phone_number.trim(),
    logo: formState.logo?.trim() || undefined,
    gst_number: formState.gst_number?.trim() || undefined,
    address: formState.address?.trim() || undefined,
    buses:
      formState.buses?.map(bus => ({
        ...bus,
        total_seats: selectValueToTotalSeats(bus.total_seats),
        amenities:
          typeof bus.amenities === 'string'
            ? bus.amenities
                .split(',')
                .map(a => a.trim())
                .filter(Boolean)
            : bus.amenities,
        source_location: bus.source_location?.trim() || undefined,
      })) || [],
  };
}
