import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument, UserRole } from '../users/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private readonly users: Model<User>, private readonly jwt: JwtService) {}
  private publicUser(user: UserDocument) { return { id: user._id.toString(), name: user.name, email: user.email, role: user.role }; }
  private async issueToken(user: UserDocument) {
    const accessToken = await this.jwt.signAsync({ sub: user._id.toString(), email: user.email, role: user.role });
    return { accessToken, user: this.publicUser(user) };
  }
  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase().trim();
    if (await this.users.exists({ email })) throw new ConflictException('An account with this email already exists');
    const passwordHash = await bcrypt.hash(dto.password, 12);
    try {
      const user = await this.users.create({ name: dto.name.trim(), email, passwordHash, role: UserRole.MEMBER });
      return this.issueToken(user);
    } catch (error) {
      if ((error as { code?: number }).code === 11000) throw new ConflictException('An account with this email already exists');
      throw error;
    }
  }
  async login(dto: LoginDto) {
    const user = await this.users.findOne({ email: dto.email.toLowerCase().trim(), isActive: true }).select('+passwordHash');
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) throw new UnauthorizedException('Invalid email or password');
    return this.issueToken(user);
  }
  async me(userId: string) {
    const user = await this.users.findById(userId);
    if (!user || !user.isActive) throw new UnauthorizedException('Account is not available');
    return this.publicUser(user);
  }
}
