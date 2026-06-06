import { describe, it, expect } from 'vitest';
import * as user_model from '../user.model';

describe('user model', () => {
  it('should be defined', () => {
    expect(user_model).toBeDefined();
  });
});
