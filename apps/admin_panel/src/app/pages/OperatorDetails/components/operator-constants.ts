import type { CountryData } from 'react-phone-input-2';
import type { OperatorPayload } from 'types/operator';

export const DEFAULT_PHONE_COUNTRY: CountryData = {
  name: 'India',
  dialCode: '91',
  countryCode: 'in',
  format: '+.. .....-.....',
};

export const detailActionButtonBase =
  'h-14 rounded-2xl px-7 text-base font-semibold transition-all duration-200 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-offset-2';
export const detailFieldControlClass =
  'h-[50px] w-full rounded-xl border border-input bg-background text-base text-foreground placeholder:text-muted-foreground';
export const detailPhoneInputClass =
  '!h-[50px] !w-full !rounded-xl !border !border-input !bg-background !pl-[56px] !text-base !text-foreground !placeholder:text-muted-foreground';

export const defaultFormState: OperatorPayload = {
  operator_name: '',
  email: '',
  country_code: '+91',
  phone_number: '',
  logo: '',
  gst_number: '',
  address: '',
  is_active: true,
  buses: [],
};

export const toErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error === 'string') {
    return error;
  }
  if (error && typeof error === 'object' && 'data' in error) {
    const maybeData = (error as { data?: { message?: string } }).data;
    if (maybeData?.message) {
      return maybeData.message;
    }
  }
  return fallback;
};
