import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class AuthDTO {
  @IsEmail({}, { message: 'Invalid e-mail' })
  @ApiProperty({
    description: 'E-mail to login',
    required: true,
    example: 'test@test.com',
  })
  email: string;

  @ApiProperty({
    description: 'Password to login',
    required: true,
    example: '123456@Lc',
  })
  @IsString({ message: 'Password must be a string' })
  password: string;
}
