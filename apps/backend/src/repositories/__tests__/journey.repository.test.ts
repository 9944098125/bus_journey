import { describe, it, expect } from 'vitest';
import * as journey_repository from '../journey.repository';

describe('journey repository', () => {
  it('should be defined', () => {
    expect(journey_repository).toBeDefined();
  });
});
