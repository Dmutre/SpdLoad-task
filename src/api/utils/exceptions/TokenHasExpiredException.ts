import { HttpException, HttpStatus } from '@nestjs/common';

export class TokenHasExpiredException extends HttpException {
  constructor () {
    super('Token has expired', HttpStatus.GONE);
  }
}