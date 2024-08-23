import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateClientDTO {
  @IsString()
  @ApiProperty({ description: 'Client name', example: 'João' })
  name?: string;

  @IsString()
  @ApiProperty({ description: 'Client CPF or CNPJ', example: '000.000.000-00' })
  cpfCnpj?: string;

  @IsString()
  @ApiProperty({
    description: 'Client phone number',
    example: '(00) 00000-0000',
  })
  phoneNumber?: string;
}
