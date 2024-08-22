import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateClientDTO {
  @IsString()
  @ApiProperty({ description: 'Client name' })
  name?: string;

  @IsString()
  @ApiProperty({ description: 'Client CPF or CNPJ' })
  cpfCnpj?: string;

  @IsString()
  @ApiProperty({ description: 'Client phone number' })
  phoneNumber?: string;
}
