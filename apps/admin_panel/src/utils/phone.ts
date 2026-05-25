import type { CountryData } from 'react-phone-input-2';

export type ParsedPhoneFields = {
  country_code: string;
  phone_number: string;
};

export const parsePhoneFields = (
  phone: string,
  country: CountryData,
): ParsedPhoneFields => {
  const dialCode = country.dialCode || '';
  const nationalNumber = phone.startsWith(dialCode)
    ? phone.slice(dialCode.length)
    : phone;

  return {
    country_code: `+${dialCode}`,
    phone_number: nationalNumber,
  };
};
