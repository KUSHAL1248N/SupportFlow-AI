import { UserRole } from '../users/user.schema';
export interface AuthUser { userId: string; email: string; role: UserRole; }
export interface JwtPayload { sub: string; email: string; role: UserRole; }
