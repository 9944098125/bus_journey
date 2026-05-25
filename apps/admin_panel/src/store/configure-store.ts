/**
 * Create the store with dynamic reducers
 */

import {
  configureStore,
  type Reducer,
  type StoreEnhancer,
} from '@reduxjs/toolkit';
import { createInjectorsEnhancer } from 'redux-injectors';
import createSagaMiddleware from 'redux-saga';
import type { RootState } from 'types';
import { rtkQueryMiddleware } from './rtk-query-middleware';
import { createReducer } from './reducers';

export function configureAppStore() {
  const reduxSagaMonitorOptions = {};
  const sagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions);
  const { run: runSaga } = sagaMiddleware;
  const middlewares = [sagaMiddleware, ...rtkQueryMiddleware];

  const enhancers = [
    createInjectorsEnhancer({
      createReducer,
      runSaga,
    }),
  ] as StoreEnhancer[];

  const store = configureStore({
    reducer: createReducer() as Reducer<RootState>,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().concat(middlewares),
    devTools: process.env.NODE_ENV !== 'production',
    enhancers: getDefaultEnhancers => getDefaultEnhancers().concat(enhancers),
  });

  return store;
}

export type AppStore = ReturnType<typeof configureAppStore>;
export type AppDispatch = AppStore['dispatch'];
