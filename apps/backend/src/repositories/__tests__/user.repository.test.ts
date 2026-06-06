import { describe, it, expect } from 'vitest';
import * as user_repository from '../user.repository';

describe('user repository', () => {
  it('should be defined', () => {
    expect(user_repository).toBeDefined();
  });
});
