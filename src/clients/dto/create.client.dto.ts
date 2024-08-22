import { IsPhoneNumber, IsString } from 'class-validator';

export class CreateClientDTO {
  @IsString()
  name: string;

  @IsString()
  cpfCnpj: string;

  @IsPhoneNumber('BR')
  phoneNumber: string;
}
