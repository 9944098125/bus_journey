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

/**
 * Standard backend response envelope:
 * { status, statusText, data: { message, data }, meta: { url } }
 *
 * The helpers below unwrap that envelope into the flat shapes consumers expect.
 */

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
};
