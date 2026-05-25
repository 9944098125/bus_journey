import { createReducer } from '../reducers';
import { Reducer } from '@reduxjs/toolkit';

describe('reducer', () => {
  it('should inject reducers', () => {
    const dummyReducer = (s = {}, a) => 'dummyResult';
    const reducer = createReducer({ test: dummyReducer } as any) as Reducer<
      any,
      any
    >;
    const state = reducer({}, '');
    expect(state.test).toBe('dummyResult');
  });

  it('should include core reducers when no extra reducers are injected', () => {
    const reducer = createReducer() as Reducer<any, any>;
    const state = reducer(undefined, { type: '@@INIT' });
    expect(state.global).toBeDefined();
    expect(state.globalApi).toBeDefined();
  });
});
