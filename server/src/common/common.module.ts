import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { RolesGuard } from './roles.guard';
@Module({ providers: [{ provide: APP_FILTER, useClass: AllExceptionsFilter }, { provide: APP_GUARD, useClass: RolesGuard }] })
export class CommonModule {}
