import { describe, it, expect } from 'vitest';
import * as email_service from '../email.service';

describe('email service', () => {
  it('should be defined', () => {
    expect(email_service).toBeDefined();
  });
});
