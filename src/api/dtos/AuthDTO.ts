import { IsEmail, IsNotEmpty, IsOptional, Matches } from 'class-validator';
import { UKR, UKRSPEC } from '../utils/constants';

export class AuthDTO {
  @IsEmail({}, { message: 'Email isn\'t valid' })
  @IsNotEmpty({ message: 'Email is empty' })
    email: string;

  @Matches(new RegExp('^[' + UKR + UKRSPEC + ']{2,40}$'), {
    message: 'Name is not correct (A-Я(укр.)\\-\' ), or too short (min: 2), or too long (max: 40)',
  })
  @IsNotEmpty({ message: 'Name is empty' })
    name: string;

  @Matches(/^(?=.*[A-Za-z])(?=.*\d).{8,32}$/, {
    message: 'Password must be between 8 and 32 characters long, contain at least one letter and one number',
  })
  @IsNotEmpty({ message: 'Password is empty' })
    password: string;
}