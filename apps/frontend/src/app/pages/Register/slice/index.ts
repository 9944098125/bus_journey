import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer } from 'utils/redux-injectors';
import { createApi } from '@reduxjs/toolkit/query/react';
import { endpoints, formatErrors, baseQuery } from 'utils/api/endpoints';

import type { UploadProfilePictureResponse } from 'types/user';

import { RegisterState } from './types';

export const initialState: RegisterState = {};

export const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {},
});

export const registerApi = createApi({
  reducerPath: 'registerApi',
  baseQuery,
  endpoints: build => ({
    register: build.mutation<any, any>({
      query: body => ({
        ...endpoints.register,
        body,
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return formatErrors(baseQueryReturnValue.data);
      },
    }),
    uploadProfilePicture: build.mutation<
      UploadProfilePictureResponse['data'],
      File
    >({
      query: file => {
        const formData = new FormData();
        formData.append('profile_picture', file);

        return {
          ...endpoints.uploadProfilePicture,
          body: formData,
          prepareHeaders: (headers: Headers) => {
            headers.delete('Content-Type');
            return headers;
          },
        };
      },
      transformResponse(response: UploadProfilePictureResponse) {
        const imageUrl = response.imageUrl ?? response.data?.imageUrl;

        if (!imageUrl) {
          throw new Error('Upload succeeded but no image URL was returned');
        }

        return {
          imageUrl,
          publicId: response.data?.publicId ?? '',
        };
      },
      transformErrorResponse(baseQueryReturnValue) {
        return formatErrors(baseQueryReturnValue.data);
      },
    }),
  }),
});

export const { actions: registerActions } = registerSlice;

export const useRegisterSlice = () => {
  useInjectReducer({
    key: registerSlice.name,
    reducer: registerSlice.reducer,
  });
  useInjectReducer({
    key: registerApi.reducerPath,
    reducer: registerApi.reducer,
  });
  return {
    actions: registerSlice.actions,
    ...registerApi,
  };
};
