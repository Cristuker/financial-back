import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsString } from 'class-validator';

export class CreateClientDTO {
  @IsString()
  @ApiProperty({ description: 'Client name', example: 'João' })
  name: string;

  @IsString()
  @ApiProperty({ description: 'Client CPF or CNPJ', example: '000.000.000-00' })
  cpfCnpj: string;

  @IsPhoneNumber('BR')
  @ApiProperty({
    description: 'Client phone number',
    example: '(00) 00000-0000',
  })
  phoneNumber: string;
}
