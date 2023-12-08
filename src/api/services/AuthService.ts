import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDTO } from '../dtos/AuthDTO';
import { UserAlreadyExistsException } from '../utils/exceptions/UserAlreadyExcistException';
import * as bcrypt from 'bcrypt';
import { MailService } from '../services/MailService';
import * as process from 'process';
import { EntityNotFoundException } from '../utils/exceptions/EntityNotFoundException';
import { State, User } from '@prisma/client';
import { TokenHasExpiredException } from '../utils/exceptions/TokenHasExpiredException';
import { JwtService } from '@nestjs/jwt';
import { HOUR } from '../utils/constants';
import { UserRepository } from '../repository/UserRepository';
import { UpdateUserDTO } from '../dtos/UpdateUserDTO';
import { UpdatePasswordDTO } from '../dtos/UpdatePasswordDTO';

@Injectable()
export class AuthService {
  constructor (
    private userRepo: UserRepository,
    private mailService: MailService,
    private jwtService: JwtService,
  ) {}

  async userExists (email: string): Promise<boolean> {
    const user = await this.userRepo.find({ email });
    return !!user;
  }

  async register (user: AuthDTO): Promise<void> {
    if (await this.userExists(user.email)) {
      throw new UserAlreadyExistsException();
    }

    const hash = await this.hashPassword(user.password);

    const { mailToken } = await this.userRepo.create({
      name: user.name,
      email: user.email,
      password: hash,
      mailToken: {
        create: {},
      },
    });

    await this.mailService.send({
      to: user.email,
      subject: 'Верифікація пошти',
      message: 'Перейдіть за посиланням, щоб підтвердити свою пошту',
      link: `${process.env.FRONT_BASE_URL}/verify/${mailToken.value}`,
    });
  }

  async login (user: User) {
    if (user.state !== State.APPROVED) {
      throw new UnauthorizedException('Email not yet verified');
    }
    return this.getTokens(user);
  }

  async verify (token: string): Promise<{ accessToken: string, refreshToken: string }> {
    const user = await this.userRepo.find({
      mailToken: { value: token },
    });

    if (!user) {
      throw new EntityNotFoundException('User');
    }

    if (Date.now() - user.mailToken.createdAt.getTime() > HOUR) {
      throw new TokenHasExpiredException();
    }

    await this.userRepo.updateById(user.id, {
      state: State.APPROVED,
      mailToken: {
        delete: {},
      },
    });

    return this.getTokens(user);
  }

  getTokens (user: User): { accessToken: string, refreshToken: string } {
    const payload = {
      sub: user.id,
      email: user.email,
      createdAt: Date.now(),
    };

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: process.env.REFRESH_TTL,
      }),
    };
  }

  async hashPassword (password: string): Promise<string> {
    const salt = 7;
    return bcrypt.hash(password, salt);
  }

  async getUser (user: User) {
    return {
      ...user,
    };
  }

  async changeAvatar(userId: string, file: Express.Multer.File) {
    const base64 = file.buffer.toString('base64');
    const user = await this.userRepo.updateById(userId, {
      avatar: base64
    });
    return user;
  }

  async updateUser(userId: string, data: UpdateUserDTO) {
    const user = await this.userRepo.updateById(userId, data);
    return user;
  }

  async updatePassword(userId: string, data: UpdatePasswordDTO) {
    if(data.newPassword === data.oldPassword) {
      throw new HttpException('Passwords are the same', HttpStatus.NOT_ACCEPTABLE);
    }

    const user = await this.userRepo.findById(userId);

    const validPassword = user.password === data.oldPassword;
    if(validPassword) {
      return await this.userRepo.updateById(userId, {password: data.newPassword});      
    } else {
      throw new HttpException('Password is incorrect', HttpStatus.NOT_ACCEPTABLE)
    }

  }
}
