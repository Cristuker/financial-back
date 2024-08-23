import { Decimal } from '@prisma/client/runtime/library';
import { ContractStatus } from '../types/status';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ContractDTO {
  @ApiProperty({ example: 1, description: 'Contract id' })
  id: number;

  @ApiProperty({ example: '12', description: 'Contract number' })
  contractNumber: string;

  @ApiProperty({
    example: '2024-08-23T00:00:00.000Z',
    description: 'Contract date',
  })
  contractDate: Date;

  @ApiProperty({ example: 120000, description: 'Contract value' })
  @Type(() => Decimal)
  contractValue: number | Decimal;

  @ApiProperty({ example: 50, description: 'Client id' })
  clientId: number;

  @ApiProperty({ example: 'Dentro do Prazo', description: 'Contract status' })
  status?: ContractStatus;

  @ApiProperty({ example: true, description: 'Contract canceled' })
  canceled: boolean;
}
