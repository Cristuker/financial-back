import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  name: string;

  @IsEmail({}, { message: 'Invalid e-mail' })
  @ApiProperty({
    description: 'E-mail to login',
    example: 'test@email.com',
    required: true,
  })
  email: string;

  @IsStrongPassword(
    {
      minLength: 6,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    },
    { message: 'Invalid password ' },
  )
  @ApiProperty({
    description: 'Password to login',
    example: 'Password@1234',
    required: true,
  })
  password: string;
}
