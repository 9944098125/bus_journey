import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from 'types/root-state';

import type { OperatorsState } from './types';

export const operatorsInitialState: OperatorsState = {
  editingOperator: null,
};

const selectOperatorsState = (state: RootState): OperatorsState =>
  state.operators ?? operatorsInitialState;

export const selectEditingOperator = createSelector(
  [selectOperatorsState],
  state => state.editingOperator,
);
