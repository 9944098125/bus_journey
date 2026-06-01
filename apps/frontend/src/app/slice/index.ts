import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer } from 'utils/redux-injectors';
import { GlobalState } from './types';
import { createApi } from '@reduxjs/toolkit/query/react';
import {
  endpoints,
  formatErrors,
  baseQuery,
  transformAuthResponse,
} from 'utils/api/endpoints';
import type { AuthUser, LoginMutationArg, LoginResponse } from 'types/user';
import {
  clearAuthStorage,
  loadAuthFromStorage,
  persistAuthToStorage,
} from 'utils/auth-storage';

const storedAuth = loadAuthFromStorage();

export const initialState: GlobalState = {
  user: storedAuth.user,
  token: storedAuth.token,
};

type SetAuthPayload = {
  user: AuthUser;
  token: string;
  rememberMe: boolean;
};

const slice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<SetAuthPayload>) {
      const { user, token, rememberMe } = action.payload;
      persistAuthToStorage(user, token, rememberMe);
      state.user = user;
      state.token = token;
    },
    setUser(
      state,
      action: PayloadAction<{ user: AuthUser; rememberMe?: boolean }>,
    ) {
      const rememberMe = action.payload.rememberMe ?? true;
      persistAuthToStorage(action.payload.user, state.token, rememberMe);
      state.user = action.payload.user;
    },
    setToken(
      state,
      action: PayloadAction<{ token: string; rememberMe?: boolean }>,
    ) {
      const rememberMe = action.payload.rememberMe ?? true;
      persistAuthToStorage(state.user, action.payload.token, rememberMe);
      state.token = action.payload.token;
    },
    logout(state) {
      clearAuthStorage();
      state.user = null;
      state.token = null;
    },
  },
});

export const api = createApi({
  reducerPath: 'globalApi',
  baseQuery,
  endpoints: build => ({
    login: build.mutation<LoginResponse, LoginMutationArg>({
      query: ({ rememberMe: _rememberMe, ...credentials }) => ({
        ...endpoints.login,
        body: credentials,
      }),
      transformResponse: transformAuthResponse,
      async onQueryStarted({ rememberMe }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            slice.actions.setAuth({
              user: data.data,
              token: data.token,
              rememberMe,
            }),
          );
        } catch {
          // Errors handled by the caller via mutation state
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return formatErrors(baseQueryReturnValue.data);
      },
    }),
    verifyFirstLogin: build.mutation<LoginResponse, string>({
      query: token => ({
        url: `${endpoints.verifyFirstLogin.url}?token=${encodeURIComponent(token)}`,
        method: endpoints.verifyFirstLogin.method,
      }),
      transformResponse: transformAuthResponse,
      async onQueryStarted(_token, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            slice.actions.setAuth({
              user: data.data,
              token: data.token,
              rememberMe: true,
            }),
          );
        } catch {
          // Errors handled by the caller via mutation state
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return formatErrors(baseQueryReturnValue.data);
      },
    }),
  }),
});

export const globalReducer = slice.reducer;

export const { actions: globalActions } = slice;

export const { useLoginMutation, useVerifyFirstLoginMutation } = api;

export const useGlobalSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectReducer({ key: api.reducerPath, reducer: api.reducer });
  return {
    actions: slice.actions,
    ...api,
  };
};
