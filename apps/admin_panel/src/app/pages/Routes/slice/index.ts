import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer } from 'utils/redux-injectors';
import { createApi } from '@reduxjs/toolkit/query/react';
import {
  endpoints,
  formatErrors,
  baseQuery,
  transformItemResponse,
  transformListResponse,
} from 'utils/api/endpoints';
import {
  RoutesState,
  GetRoutesQueryArg,
  GetRoutesResponse,
  CreateRouteMutationArg,
  UpdateRouteMutationArg,
  Route,
} from './types';

export const initialState: RoutesState = {};

const slice = createSlice({
  name: 'routes',
  initialState,
  reducers: {},
});

export const api = createApi({
  reducerPath: 'routesApi',
  baseQuery,
  tagTypes: ['Routes', 'Route'],
  endpoints: build => ({
    getRoutes: build.query<GetRoutesResponse, GetRoutesQueryArg | void>({
      query: (input = {}) => {
        const arg: GetRoutesQueryArg = input || {};
        const params = new URLSearchParams();
        if (arg.page) params.append('page', arg.page.toString());
        if (arg.limit) params.append('limit', arg.limit.toString());
        if (arg.search) params.append('search', arg.search);
        if (arg.source_city) params.append('source_city', arg.source_city);
        if (arg.destination_city)
          params.append('destination_city', arg.destination_city);
        if (arg.status === 'active' || arg.status === 'inactive')
          params.append('status', arg.status);

        const queryStr = params.toString() ? `?${params.toString()}` : '';

        return {
          url: `${endpoints.routes.list.url}${queryStr}`,
          method: endpoints.routes.list.method,
        };
      },
      transformResponse: transformListResponse,
      providesTags: result =>
        result
          ? [
              ...result.data.map(({ _id }) => ({
                type: 'Route' as const,
                id: _id,
              })),
              { type: 'Routes', id: 'LIST' },
            ]
          : [{ type: 'Routes', id: 'LIST' }],
      transformErrorResponse: formatErrors,
    }),

    getRouteById: build.query<{ success: boolean; data: Route }, string>({
      query: id => endpoints.routes.byId(id),
      transformResponse: transformItemResponse,
      providesTags: (result, error, id) => [{ type: 'Route', id }],
      transformErrorResponse: formatErrors,
    }),

    createRoute: build.mutation<
      { success: boolean; message: string; data: Route },
      CreateRouteMutationArg
    >({
      query: body => ({
        ...endpoints.routes.create,
        body,
      }),
      transformResponse: transformItemResponse,
      invalidatesTags: [{ type: 'Routes', id: 'LIST' }],
      transformErrorResponse: formatErrors,
    }),

    updateRoute: build.mutation<
      { success: boolean; message: string; data: Route },
      UpdateRouteMutationArg
    >({
      query: ({ id, ...body }) => ({
        ...endpoints.routes.update(id),
        body,
      }),
      transformResponse: transformItemResponse,
      invalidatesTags: (result, error, { id }) => [
        { type: 'Route', id },
        { type: 'Routes', id: 'LIST' },
      ],
      transformErrorResponse: formatErrors,
    }),

    deleteRoute: build.mutation<
      { success: boolean; message: string },
      string
    >({
      query: id => endpoints.routes.delete(id),
      transformResponse: transformItemResponse,
      invalidatesTags: [{ type: 'Routes', id: 'LIST' }],
      transformErrorResponse: formatErrors,
    }),
  }),
});

export const {
  useGetRoutesQuery,
  useGetRouteByIdQuery,
  useCreateRouteMutation,
  useUpdateRouteMutation,
  useDeleteRouteMutation,
} = api;

export const useRoutesSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectReducer({ key: api.reducerPath, reducer: api.reducer });
  return { actions: slice.actions };
};
