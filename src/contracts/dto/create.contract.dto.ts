import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsString } from 'class-validator';

export class CreateContractDTO {
  @IsString()
  @ApiProperty({ description: 'Contract number', example: 12 })
  contractNumber: string;

  @IsDateString()
  @ApiProperty({
    description: 'Contract date',
    example: '2024-08-23T00:00:00.000Z',
  })
  contractDate: Date;

  @IsNumber()
  @ApiProperty({ description: 'Contract value', example: 120000 })
  contractValue: number;

  @IsNumber()
  @ApiProperty({ description: 'Client id', example: 50 })
  clientId: number;
}
