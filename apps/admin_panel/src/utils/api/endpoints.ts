import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from 'types';

const baseUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5001/api';

const defaultHeaders = {
  'Content-Type': 'application/json',
};

const prepareHeaders = (headers: any, { getState }) => {
  const token = (getState() as RootState)?.global?.token;
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  return headers;
};
export const baseQuery = fetchBaseQuery({
  baseUrl,
  headers: defaultHeaders,
  prepareHeaders,
});

export const formatErrors = (errors: any) => {
  if (typeof errors === 'string') {
    return errors;
  }
  return errors?.message || errors?.error || 'Something went wrong';
};

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};

export const endpoints = {
  baseUrl,
  login: {
    url: '/users/login',
    method: HTTP_METHODS.POST,
  },
  register: {
    url: '/users/register',
    method: HTTP_METHODS.POST,
  },
  verifyFirstLogin: {
    url: '/users/login/verify',
    method: HTTP_METHODS.GET,
  },
  uploadProfilePicture: {
    url: '/users/upload-profile-picture',
    method: HTTP_METHODS.POST,
  },
  /** Admin dashboard — requires ADMIN JWT */
  dashboard: {
    full: {
      url: '/admin/dashboard',
      method: HTTP_METHODS.GET,
    },
    kpis: {
      url: '/admin/dashboard/kpis',
      method: HTTP_METHODS.GET,
    },
    quickActions: {
      url: '/admin/dashboard/quick-actions',
      method: HTTP_METHODS.GET,
    },
    analytics: {
      url: '/admin/dashboard/analytics',
      method: HTTP_METHODS.GET,
    },
    walletRewards: {
      url: '/admin/dashboard/wallet-rewards',
      method: HTTP_METHODS.GET,
    },
    recentAccounts: {
      url: '/admin/dashboard/recent-accounts',
      method: HTTP_METHODS.GET,
    },
  },
};
