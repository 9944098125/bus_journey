import { describe, it, expect } from 'vitest';
import * as admin_dashboard_repository from '../admin-dashboard.repository';

describe('admin-dashboard repository', () => {
  it('should be defined', () => {
    expect(admin_dashboard_repository).toBeDefined();
  });
});
