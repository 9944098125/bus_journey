import { describe, it, expect } from 'vitest';
import * as route_repository from '../route.repository';

describe('route repository', () => {
  it('should be defined', () => {
    expect(route_repository).toBeDefined();
  });
});
