import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from 'types';

const baseUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5001/api';

const prepareHeaders = (headers: any, { getState }) => {
  const token = (getState() as RootState)?.global?.token;
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  return headers;
};
export const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders,
});

export const formatErrors = (errors: any) => {
  if (typeof errors === 'string') {
    return errors;
  }
  
  // RTK Query wraps the response in data. The backend response has its own data envelope.
  if (errors?.data?.data?.message) {
    return errors.data.data.message;
  }
  
  if (errors?.data && typeof errors.data === 'object') {
    if (errors.data.message) return errors.data.message;
    if (errors.data.error) return errors.data.error;
  }
  
  return errors?.message || errors?.error || 'Something went wrong';
};

/**
 * Standard backend response envelope:
 * { status, statusText, data: { message, data }, meta: { url } }
 *
 * The helpers below unwrap that envelope back into the flat shapes the
 * RTK Query endpoints / components already expect, so consumers stay unchanged.
 */

/** Unwrap a paginated list envelope. `data.data` = { pageNumber, pageSize, totalPages, totalDocuments, documents } */
export const transformListResponse = (response: any) => {
  const inner = response?.data?.data ?? {};
  const documents = inner.documents ?? [];
  const totalDocuments = inner.totalDocuments ?? documents.length;
  const pageSize = inner.pageSize ?? documents.length;
  const pageNumber = inner.pageNumber ?? 1;
  const totalPages = inner.totalPages ?? 1;

  return {
    success: true,
    message: response?.data?.message ?? '',
    data: documents,
    documents,
    total: totalDocuments,
    count: totalDocuments,
    totalDocuments,
    page: pageNumber,
    pageNumber,
    limit: pageSize,
    pageSize,
    totalPages,
  };
};

/** Unwrap a single-item / detail / mutation envelope. `data.data` = the item (or null). */
export const transformItemResponse = (response: any) => ({
  success: true,
  message: response?.data?.message ?? '',
  data: response?.data?.data ?? null,
});

/** Unwrap an auth envelope. `data.data` = { token, user }. */
export const transformAuthResponse = (response: any) => ({
  success: true,
  message: response?.data?.message ?? '',
  token: response?.data?.data?.token ?? '',
  data: response?.data?.data?.user ?? null,
});

/** Unwrap an upload envelope. `data.data` = { imageUrl, publicId }. */
export const transformUploadResponse = (response: any) => {
  const imageUrl =
    response?.data?.data?.imageUrl ??
    response?.data?.imageUrl ??
    response?.imageUrl;

  if (!imageUrl) {
    throw new Error('Upload succeeded but no image URL was returned');
  }

  return {
    imageUrl,
    publicId:
      response?.data?.data?.publicId ?? response?.data?.publicId ?? '',
  };
};

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
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
  operators: {
    list: {
      url: '/operators',
      method: HTTP_METHODS.GET,
    },
    create: {
      url: '/operators',
      method: HTTP_METHODS.POST,
    },

    byId: (id: string) => ({
      url: `/operators/${id}`,
      method: HTTP_METHODS.GET,
    }),
    update: (id: string) => ({
      url: `/operators/${id}`,
      method: HTTP_METHODS.PATCH,
    }),
    delete: (id: string) => ({
      url: `/operators/${id}`,
      method: HTTP_METHODS.DELETE,
    }),
  },
  buses: {
    list: {
      url: '/buses',
      method: HTTP_METHODS.GET,
    },
    create: {
      url: '/buses',
      method: HTTP_METHODS.POST,
    },
    uploadDriverPhoto: {
      url: '/buses/upload-driver-photo',
      method: HTTP_METHODS.POST,
    },
    uploadDrivingLicense: {
      url: '/buses/upload-driving-license',
      method: HTTP_METHODS.POST,
    },
    uploadBusPhoto: {
      url: '/buses/upload-bus-photo',
      method: HTTP_METHODS.POST,
    },
    byId: (id: string) => ({
      url: `/buses/${id}`,
      method: HTTP_METHODS.GET,
    }),
    update: (id: string) => ({
      url: `/buses/${id}`,
      method: HTTP_METHODS.PATCH,
    }),
    delete: (id: string) => ({
      url: `/buses/${id}`,
      method: HTTP_METHODS.DELETE,
    }),
  },
  routes: {
    list: {
      url: '/routes',
      method: HTTP_METHODS.GET,
    },
    create: {
      url: '/routes',
      method: HTTP_METHODS.POST,
    },
    byId: (id: string) => ({
      url: `/routes/${id}`,
      method: HTTP_METHODS.GET,
    }),
    update: (id: string) => ({
      url: `/routes/${id}`,
      method: HTTP_METHODS.PATCH,
    }),
    delete: (id: string) => ({
      url: `/routes/${id}`,
      method: HTTP_METHODS.DELETE,
    }),
  },
  journeys: {
    list: {
      url: '/journeys',
      method: HTTP_METHODS.GET,
    },
    create: {
      url: '/journeys',
      method: HTTP_METHODS.POST,
    },
    byId: (id: string) => ({
      url: `/journeys/${id}`,
      method: HTTP_METHODS.GET,
    }),
    update: (id: string) => ({
      url: `/journeys/${id}`,
      method: HTTP_METHODS.PATCH,
    }),
    delete: (id: string) => ({
      url: `/journeys/${id}`,
      method: HTTP_METHODS.DELETE,
    }),
  },
};
