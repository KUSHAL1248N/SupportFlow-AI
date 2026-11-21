import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}
  @Post('register') register(@Body() dto: RegisterDto) { return this.auth.register(dto); }
  @Post('login') login(@Body() dto: LoginDto) { return this.auth.login(dto); }
  @ApiBearerAuth() @UseGuards(JwtAuthGuard) @Get('me') me(@Req() req: Request & { user: { userId: string } }) { return this.auth.me(req.user.userId); }
}
