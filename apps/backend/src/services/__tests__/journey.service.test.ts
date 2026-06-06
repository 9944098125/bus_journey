import { describe, it, expect } from 'vitest';
import * as journey_service from '../journey.service';

describe('journey service', () => {
  it('should be defined', () => {
    expect(journey_service).toBeDefined();
  });
});
