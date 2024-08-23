import { ContractDTO } from '@app/contracts/dto/contract.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ClientDTO {
  @ApiProperty({ description: 'Client id', example: 1 })
  id: number;

  @ApiProperty({ description: 'Client name', example: 'João' })
  name: string;

  @ApiProperty({ description: 'Client CPF or CNPJ', example: '000.000.000-00' })
  cpfCnpj: string;

  @ApiProperty({
    description: 'Client phone number',
    example: '(00) 00000-0000',
  })
  phoneNumber: string;

  @ApiProperty({ description: 'Client contracts', type: [ContractDTO] })
  contracts: ContractDTO[];
}
