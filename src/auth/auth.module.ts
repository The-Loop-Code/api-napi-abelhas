import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ClerkJwtStrategy } from './strategies/clerk-jwt.strategy';
import { ClerkAuthGuard } from './guards/clerk-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [PassportModule],
  providers: [AuthService, ClerkJwtStrategy, ClerkAuthGuard, RolesGuard],
  controllers: [AuthController],
  exports: [AuthService, ClerkAuthGuard, RolesGuard],
})
export class AuthModule {}
