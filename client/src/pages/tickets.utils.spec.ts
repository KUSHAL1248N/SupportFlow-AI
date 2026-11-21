import { describe, expect, it } from 'vitest';
import { isUrgent, statusLabel } from './tickets.utils';
describe('ticket helpers', () => {
  it('formats a ticket status', () => expect(statusLabel('in_progress')).toBe('In Progress'));
  it('identifies urgent tickets', () => { expect(isUrgent('urgent')).toBe(true); expect(isUrgent('low')).toBe(false); });
});
