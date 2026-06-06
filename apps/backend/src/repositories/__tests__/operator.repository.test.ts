import { describe, it, expect } from 'vitest';
import * as operator_repository from '../operator.repository';

describe('operator repository', () => {
  it('should be defined', () => {
    expect(operator_repository).toBeDefined();
  });
});
