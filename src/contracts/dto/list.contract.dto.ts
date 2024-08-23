import { ApiProperty } from '@nestjs/swagger';
import { ContractDTO } from './contract.dto';

export class ListContractDTO {
  @ApiProperty({ description: 'Contract list', type: [ContractDTO] })
  contracts: ContractDTO[];
}
