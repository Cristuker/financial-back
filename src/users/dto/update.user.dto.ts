import { IsString } from 'class-validator';

export class UpdateUserDTO {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  cpfCnpj: string;
}
