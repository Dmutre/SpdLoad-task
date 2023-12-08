import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { PrismaService } from '../../api/services/PrismaService';
import { EntityNotFoundException } from '../../api/utils/exceptions/EntityNotFoundException';
import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor (
    private prisma: PrismaService,
  ) {
    super({ usernameField: 'email' });
  }

  async validate (email: string, password: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });
    if (!user) throw new EntityNotFoundException('User');

    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Password is wrong');

    delete user.password;
    return user;
  }
}