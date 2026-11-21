import { HealthService } from './health.service';
describe('HealthService', () => {
  it('returns an OK status and timestamp', () => {
    const result = new HealthService().getStatus();
    expect(result.status).toBe('ok');
    expect(Number.isNaN(Date.parse(result.timestamp))).toBe(false);
  });
});
