import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import * as process from 'process';
import { JwtPayloadDTO } from '../../api/dtos/JWTPayloadDTO';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/api/services/PrismaService';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor (
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET,
    });
  }

  async validate (payload: JwtPayloadDTO): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: {
        id: payload.sub,
      },
    });

    if (!user) throw new UnauthorizedException();
    delete user.password;

    return user;
  }
}