/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from '@reduxjs/toolkit';

import { api, globalReducer } from 'app/slice';
import { InjectedReducersType } from 'utils/types/injector-typings';

const coreReducers = {
  global: globalReducer,
  [api.reducerPath]: api.reducer,
};

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
export function createReducer(injectedReducers: InjectedReducersType = {}) {
  const reducers = { ...coreReducers, ...injectedReducers };

  if (Object.keys(reducers).length === 0) {
    return state => state;
  }

  return combineReducers(reducers);
}
