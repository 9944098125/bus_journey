import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer } from 'utils/redux-injectors';
import { BusesState, GetBusesQueryArg, GetBusesResponse, CreateBusMutationArg, UpdateBusMutationArg, Bus } from './types';
import { createApi } from '@reduxjs/toolkit/query/react';
import {
  endpoints,
  formatErrors,
  baseQuery,
  transformItemResponse,
  transformListResponse,
  transformUploadResponse,
} from 'utils/api/endpoints';

export const initialState: BusesState = {};

const slice = createSlice({
  name: 'buses',
  initialState,
  reducers: {},
});

export const api = createApi({
  reducerPath: 'busesApi',
  baseQuery,
  tagTypes: ['Buses', 'Bus'],
  endpoints: build => ({
    getBuses: build.query<GetBusesResponse, GetBusesQueryArg | void>({
      query: (input = {}) => {
        const arg: GetBusesQueryArg = input || {};
        const params = new URLSearchParams();
        if (arg.page) params.append('page', arg.page.toString());
        if (arg.limit) params.append('limit', arg.limit.toString());
        if (arg.search) params.append('search', arg.search);
        if (arg.operator) params.append('operator', arg.operator);
        if (arg.is_active !== undefined) params.append('is_active', arg.is_active.toString());
        if (arg.seats) params.append('seats', arg.seats);
        if (arg.bus_type) params.append('bus_type', arg.bus_type);

        const queryStr = params.toString() ? `?${params.toString()}` : '';

        return {
          url: `${endpoints.buses.list.url}${queryStr}`,
          method: endpoints.buses.list.method,
        };
      },
      transformResponse: transformListResponse,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Bus' as const, id: _id })),
              { type: 'Buses', id: 'LIST' },
            ]
          : [{ type: 'Buses', id: 'LIST' }],
      transformErrorResponse: formatErrors,
    }),

    getBusById: build.query<{ success: boolean; data: Bus }, string>({
      query: id => endpoints.buses.byId(id),
      transformResponse: transformItemResponse,
      providesTags: (result, error, id) => [{ type: 'Bus', id }],
      transformErrorResponse: formatErrors,
    }),

    createBus: build.mutation<{ success: boolean; message: string; data: Bus }, CreateBusMutationArg>({
      query: body => ({
        ...endpoints.buses.create,
        body,
      }),
      transformResponse: transformItemResponse,
      invalidatesTags: [{ type: 'Buses', id: 'LIST' }],
      transformErrorResponse: formatErrors,
    }),

    updateBus: build.mutation<{ success: boolean; message: string; data: Bus }, UpdateBusMutationArg>({
      query: ({ id, ...body }) => ({
        ...endpoints.buses.update(id),
        body,
      }),
      transformResponse: transformItemResponse,
      invalidatesTags: (result, error, { id }) => [
        { type: 'Bus', id },
        { type: 'Buses', id: 'LIST' },
      ],
      transformErrorResponse: formatErrors,
    }),

    deleteBus: build.mutation<{ success: boolean; message: string }, string>({
      query: id => endpoints.buses.delete(id),
      transformResponse: transformItemResponse,
      invalidatesTags: [{ type: 'Buses', id: 'LIST' }],
      transformErrorResponse: formatErrors,
    }),

    uploadBusPhoto: build.mutation<
      { imageUrl: string; publicId: string },
      File
    >({
      query: file => {
        const formData = new FormData();
        formData.append('bus_photo', file);

        return {
          ...endpoints.buses.uploadBusPhoto,
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
  useGetBusesQuery,
  useGetBusByIdQuery,
  useCreateBusMutation,
  useUpdateBusMutation,
  useDeleteBusMutation,
  useUploadBusPhotoMutation,
} = api;

export const useBusesSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectReducer({ key: api.reducerPath, reducer: api.reducer });
  return { actions: slice.actions };
};
