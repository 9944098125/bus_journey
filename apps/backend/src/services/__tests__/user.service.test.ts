import { describe, it, expect } from 'vitest';
import * as user_service from '../user.service';

describe('user service', () => {
  it('should be defined', () => {
    expect(user_service).toBeDefined();
  });
});
