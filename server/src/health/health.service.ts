import { Injectable } from '@nestjs/common';
@Injectable()
export class HealthService {
  getStatus() { return { status: 'ok', service: process.env.APP_TITLE || 'API', timestamp: new Date().toISOString() }; }
}
