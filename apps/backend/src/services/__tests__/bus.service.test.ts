import { describe, it, expect } from 'vitest';
import * as bus_service from '../bus.service';

describe('bus service', () => {
  it('should be defined', () => {
    expect(bus_service).toBeDefined();
  });
});
