import { Module } from '@nestjs/common';
import { AuthService } from '../services/AuthService';
import { AuthController } from '../controllers/AuthController';
import { MailModule } from './MailModule';
import { JwtModule } from '@nestjs/jwt';
import * as process from 'process';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../../security/strategies/JwtStrategy';
import { LocalStrategy } from '../../security/strategies/LocalStrategy';

@Module({
  providers: [AuthService, JwtStrategy, LocalStrategy],
  controllers: [AuthController],
  imports: [
    MailModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.SECRET,
      signOptions: {
        expiresIn: process.env.ACCESS_TTL,
      },
    }),
  ],
})
export class AuthModule {}
