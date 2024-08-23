import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateUserDTO {
  @IsString()
  @ApiProperty({ description: 'User name', example: 'João' })
  name: string;

  @IsString()
  @ApiProperty({ description: 'User email', example: 'test@test.com' })
  email: string;

  @IsString()
  @ApiProperty({ description: 'User password', example: '123456@Lc' })
  password: string;
}
