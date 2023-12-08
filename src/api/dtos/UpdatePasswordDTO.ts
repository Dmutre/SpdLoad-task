import { IsNotEmpty, Matches } from "class-validator";


export class UpdatePasswordDTO {
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).{8,32}$/, {
    message: 'Password must be between 8 and 32 characters long, contain at least one letter and one number',
  })
  @IsNotEmpty({ message: 'Old password is empty' })
  readonly oldPassword: string;

  @Matches(/^(?=.*[A-Za-z])(?=.*\d).{8,32}$/, {
    message: 'Password must be between 8 and 32 characters long, contain at least one letter and one number',
  })
  @IsNotEmpty({ message: 'New password is empty' })
  readonly newPassword: string;
}