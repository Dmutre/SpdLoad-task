import { Body, Controller, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthDTO } from '../dtos/AuthDTO';
import { AuthService } from '../services/AuthService';
import { JwtAuthGuard } from '../guard/JWTAuthGuard';
import { LocalAuthGuard } from '../guard/LocalAuthGuard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDTO } from '../dtos/UpdateUserDTO';
import { UpdatePasswordDTO } from '../dtos/UpdatePasswordDTO';

@Controller({
  version: '1',
  path: '/auth',
})
export class AuthController {
  constructor (
    private authService: AuthService,
  ) {}

  @Post('/register')
  async register (
    @Body() body: AuthDTO,
  ) {
    return this.authService.register(body);
  }

  @Post('/verify/:token')
  async verify (
    @Param('token') token: string,
  ) {
    return this.authService.verify(token);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/refresh')
  async refresh (
    @Req() req,
  ) {
    return this.authService.getTokens(req.user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login (
    @Req() req,
  ) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async getUser (
    @Req() req,
  ) {
    return this.authService.getUser(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/changeAvatar')
  @UseInterceptors(FileInterceptor('file'))
  async changeAvatar(
    @Req() req,
    @UploadedFile(new ParseFilePipe({
      validators: [
        new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
      ],
    })) file: Express.Multer.File
    ) {
    return await this.authService.changeAvatar(req.user.id, file)
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update')
  async updateUser(
    @Req() req,
    @Body() data: UpdateUserDTO
  ) {
    return await this.authService.updateUser(req.user.id, data)
  }

  @UseGuards(JwtAuthGuard)
  @Patch('updatePassword')
  async updatePassword(
    @Req() req,
    @Body() data: UpdatePasswordDTO,
  ) {
    return await this.authService.updatePassword(req.user.id, data);
  }
}
