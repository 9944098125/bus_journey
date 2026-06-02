import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer } from 'utils/redux-injectors';
import { createApi } from '@reduxjs/toolkit/query/react';
import {
  endpoints,
  formatErrors,
  baseQuery,
  transformItemResponse,
  transformListResponse,
  transformUploadResponse,
} from 'utils/api/endpoints';
import {
  JourneysState,
  GetJourneysQueryArg,
  GetJourneysResponse,
  CreateJourneyMutationArg,
  UpdateJourneyMutationArg,
  Journey,
} from './types';

export const initialState: JourneysState = {};

const slice = createSlice({
  name: 'journeys',
  initialState,
  reducers: {},
});

export const api = createApi({
  reducerPath: 'journeysApi',
  baseQuery,
  tagTypes: ['Journeys', 'Journey'],
  endpoints: build => ({
    getJourneys: build.query<GetJourneysResponse, GetJourneysQueryArg | void>({
      query: (arg = {}) => {
        const params = new URLSearchParams();
        if (arg.page) params.append('page', arg.page.toString());
        if (arg.limit) params.append('limit', arg.limit.toString());
        if (arg.search) params.append('search', arg.search);
        if (arg.route) params.append('route', arg.route);
        if (arg.bus) params.append('bus', arg.bus);
        if (arg.operator) params.append('operator', arg.operator);
        if (arg.status) params.append('status', arg.status);
        if (arg.is_active !== undefined)
          params.append('is_active', String(arg.is_active));
        if (arg.departure_from)
          params.append('departure_from', arg.departure_from);
        if (arg.departure_to) params.append('departure_to', arg.departure_to);

        const queryStr = params.toString() ? `?${params.toString()}` : '';

        return {
          url: `${endpoints.journeys.list.url}${queryStr}`,
          method: endpoints.journeys.list.method,
        };
      },
      transformResponse: transformListResponse,
      providesTags: result =>
        result
          ? [
              ...result.data.map(({ _id }) => ({
                type: 'Journey' as const,
                id: _id,
              })),
              { type: 'Journeys', id: 'LIST' },
            ]
          : [{ type: 'Journeys', id: 'LIST' }],
      transformErrorResponse: formatErrors,
    }),

    getJourneyById: build.query<{ success: boolean; data: Journey }, string>({
      query: id => endpoints.journeys.byId(id),
      transformResponse: transformItemResponse,
      providesTags: (result, error, id) => [{ type: 'Journey', id }],
      transformErrorResponse: formatErrors,
    }),

    createJourney: build.mutation<
      { success: boolean; message: string; data: Journey },
      CreateJourneyMutationArg
    >({
      query: body => ({
        ...endpoints.journeys.create,
        body,
      }),
      transformResponse: transformItemResponse,
      invalidatesTags: [{ type: 'Journeys', id: 'LIST' }],
      transformErrorResponse: formatErrors,
    }),

    updateJourney: build.mutation<
      { success: boolean; message: string; data: Journey },
      UpdateJourneyMutationArg
    >({
      query: ({ id, ...body }) => ({
        ...endpoints.journeys.update(id),
        body,
      }),
      transformResponse: transformItemResponse,
      invalidatesTags: (result, error, { id }) => [
        { type: 'Journey', id },
        { type: 'Journeys', id: 'LIST' },
      ],
      transformErrorResponse: formatErrors,
    }),

    deleteJourney: build.mutation<{ success: boolean; message: string }, string>(
      {
        query: id => endpoints.journeys.delete(id),
        transformResponse: transformItemResponse,
        invalidatesTags: [{ type: 'Journeys', id: 'LIST' }],
        transformErrorResponse: formatErrors,
      },
    ),
    uploadDriverPhoto: build.mutation<
      { imageUrl: string; publicId: string },
      File
    >({
      query: file => {
        const formData = new FormData();
        formData.append('driver_photo', file);

        return {
          ...endpoints.journeys.uploadDriverPhoto,
          body: formData,
          prepareHeaders: (headers: Headers) => {
            headers.delete('Content-Type');
            return headers;
          },
        };
      },
      transformResponse: transformUploadResponse,
      transformErrorResponse(baseQueryReturnValue) {
        return formatErrors(baseQueryReturnValue.data);
      },
    }),
    uploadDrivingLicense: build.mutation<
      { imageUrl: string; publicId: string },
      File
    >({
      query: file => {
        const formData = new FormData();
        formData.append('driving_license', file);

        return {
          ...endpoints.journeys.uploadDrivingLicense,
          body: formData,
          prepareHeaders: (headers: Headers) => {
            headers.delete('Content-Type');
            return headers;
          },
        };
      },
      transformResponse: transformUploadResponse,
      transformErrorResponse(baseQueryReturnValue) {
        return formatErrors(baseQueryReturnValue.data);
      },
    }),
  }),
});

export const {
  useGetJourneysQuery,
  useGetJourneyByIdQuery,
  useCreateJourneyMutation,
  useUpdateJourneyMutation,
  useDeleteJourneyMutation,
  useUploadDriverPhotoMutation,
  useUploadDrivingLicenseMutation,
} = api;

export const useJourneysSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectReducer({ key: api.reducerPath, reducer: api.reducer });
  return { actions: slice.actions };
};
