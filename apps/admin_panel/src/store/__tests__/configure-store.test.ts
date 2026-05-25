import { configureAppStore } from '../configure-store';

describe('configure-store', () => {
  it('should return a store with injected enhancers', () => {
    const store = configureAppStore();
    expect(store).toEqual(
      expect.objectContaining({
        runSaga: expect.any(Function),
        injectedReducers: expect.any(Object),
        injectedSagas: expect.any(Object),
      }),
    );
  });

  it('should return an empty store', () => {
    const store = configureAppStore();
    expect(store.getState()).toBeUndefined();
  });
});
