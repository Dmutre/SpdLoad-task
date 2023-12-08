import { IsEmail, IsNotEmpty, IsOptional, Matches } from 'class-validator';
import { UKR, UKRSPEC } from '../utils/constants';

export class UpdateUserDTO {
  @IsOptional()
  @IsEmail({}, { message: 'Email isn\'t valid' })
  @IsNotEmpty({ message: 'Email is empty' })
    email: string;

  @IsOptional()
  @Matches(new RegExp('^[' + UKR + UKRSPEC + ']{2,40}$'), {
    message: 'Name is not correct (A-Я(укр.)\\-\' ), or too short (min: 2), or too long (max: 40)',
  })
  @IsNotEmpty({ message: 'Name is empty' })
    name: string;
}