import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthService } from './health.service';
@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly health: HealthService) {}
  @Get() status() { return this.health.getStatus(); }
}
