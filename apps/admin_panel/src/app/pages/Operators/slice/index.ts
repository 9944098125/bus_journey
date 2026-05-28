import type { PayloadAction } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import { useDispatch, useSelector } from 'react-redux';

import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer } from 'utils/redux-injectors';
import { baseQuery, endpoints, formatErrors } from 'utils/api/endpoints';
import type {
  Operator,
  OperatorListResponse,
  OperatorMutationResponse,
  OperatorPayload,
  OperatorSingleResponse,
  UploadOperatorImageResponse,
} from 'types/operator';
import { operatorsInitialState, selectEditingOperator } from './selectors';

const operatorsSlice = createSlice({
  name: 'operators',
  initialState: operatorsInitialState,
  reducers: {
    setEditingOperator(state, action: PayloadAction<Operator>) {
      state.editingOperator = action.payload;
    },
    clearEditingOperator(state) {
      state.editingOperator = null;
    },
  },
});

export const operatorsActions = operatorsSlice.actions;
export const operatorsReducer = operatorsSlice.reducer;

/**
 * RTK Query API for operator management endpoints (GET/POST/PATCH/DELETE /api/operators).
 * Reducer is injected when Operators pages mount via {@link useOperatorsSlice}.
 */
export const operatorsApi = createApi({
  reducerPath: 'operatorsApi',
  baseQuery,
  tagTypes: ['Operators', 'Operator'],
  endpoints: build => ({
    getOperators: build.query<
      OperatorListResponse,
      { is_active?: boolean } | undefined
    >({
      query: params => ({
        url: endpoints.operators.list.url,
        method: endpoints.operators.list.method,
        ...(params ? { params } : {}),
      }),
      providesTags: result =>
        result?.data
          ? [
              ...result.data.map(operator => ({
                type: 'Operator' as const,
                id: operator._id,
              })),
              { type: 'Operators' as const, id: 'LIST' },
            ]
          : [{ type: 'Operators' as const, id: 'LIST' }],
      transformErrorResponse(baseQueryReturnValue) {
        return formatErrors(baseQueryReturnValue.data);
      },
    }),
    getOperatorById: build.query<OperatorSingleResponse, string>({
      query: id => ({
        ...endpoints.operators.byId(id),
      }),
      providesTags: (_result, _error, id) => [{ type: 'Operator', id }],
      transformErrorResponse(baseQueryReturnValue) {
        return formatErrors(baseQueryReturnValue.data);
      },
    }),
    createOperator: build.mutation<OperatorSingleResponse, OperatorPayload>({
      query: payload => ({
        ...endpoints.operators.create,
        body: payload,
      }),
      invalidatesTags: [{ type: 'Operators', id: 'LIST' }],
      transformErrorResponse(baseQueryReturnValue) {
        return formatErrors(baseQueryReturnValue.data);
      },
    }),
    updateOperator: build.mutation<
      OperatorSingleResponse,
      { id: string; payload: Partial<OperatorPayload> }
    >({
      query: ({ id, payload }) => ({
        ...endpoints.operators.update(id),
        body: payload,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Operators', id: 'LIST' },
        { type: 'Operator', id },
      ],
      transformErrorResponse(baseQueryReturnValue) {
        return formatErrors(baseQueryReturnValue.data);
      },
    }),
    deleteOperator: build.mutation<OperatorMutationResponse, string>({
      query: id => ({
        ...endpoints.operators.delete(id),
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Operators', id: 'LIST' },
        { type: 'Operator', id },
      ],
      transformErrorResponse(baseQueryReturnValue) {
        return formatErrors(baseQueryReturnValue.data);
      },
    }),
    uploadDriverPhoto: build.mutation<
      { imageUrl: string; publicId: string },
      File
    >({
      query: file => {
        const formData = new FormData();
        formData.append('driver_photo', file);

        return {
          ...endpoints.operators.uploadDriverPhoto,
          body: formData,
          prepareHeaders: (headers: Headers) => {
            headers.delete('Content-Type');
            return headers;
          },
        };
      },
      transformResponse(response: UploadOperatorImageResponse) {
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
    uploadDrivingLicense: build.mutation<
      { imageUrl: string; publicId: string },
      File
    >({
      query: file => {
        const formData = new FormData();
        formData.append('driving_license', file);

        return {
          ...endpoints.operators.uploadDrivingLicense,
          body: formData,
          prepareHeaders: (headers: Headers) => {
            headers.delete('Content-Type');
            return headers;
          },
        };
      },
      transformResponse(response: UploadOperatorImageResponse) {
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

export const {
  useGetOperatorsQuery,
  useGetOperatorByIdQuery,
  useCreateOperatorMutation,
  useUpdateOperatorMutation,
  useDeleteOperatorMutation,
  useUploadDriverPhotoMutation,
  useUploadDrivingLicenseMutation,
} = operatorsApi;

export { selectEditingOperator } from './selectors';

/** Operators edit state from Redux + dispatch helpers for edit lifecycle. */
export function useOperatorsEditor() {
  useOperatorsSlice();

  const dispatch = useDispatch();
  const editingOperator = useSelector(selectEditingOperator);

  return {
    editingOperator,
    setEditingOperator: (operator: Operator) => {
      dispatch(operatorsActions.setEditingOperator(operator));
    },
    clearEditingOperator: () => {
      dispatch(operatorsActions.clearEditingOperator());
    },
  };
}

/**
 * Injects operators UI reducer and RTK Query reducer; exposes operators hooks/apis.
 */
export const useOperatorsSlice = () => {
  useInjectReducer({
    key: operatorsSlice.name,
    reducer: operatorsReducer,
  });
  useInjectReducer({
    key: operatorsApi.reducerPath as 'operatorsApi',
    reducer: operatorsApi.reducer,
  });

  return {
    ...operatorsApi,
  };
};
