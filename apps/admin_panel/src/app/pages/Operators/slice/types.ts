import type { Operator } from 'types/operator';

export type { Operator };

/** Client-side operator UI state (currently active operator under edit). */
export interface OperatorsState {
  editingOperator: Operator | null;
}
