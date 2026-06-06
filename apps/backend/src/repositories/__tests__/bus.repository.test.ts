import { describe, it, expect } from 'vitest';
import * as bus_repository from '../bus.repository';

describe('bus repository', () => {
  it('should be defined', () => {
    expect(bus_repository).toBeDefined();
  });
});
