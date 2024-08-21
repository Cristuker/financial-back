import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsString } from 'class-validator';

export class CreateContractDTO {
  @IsString()
  @ApiProperty({ description: 'Contract number', example: 12 })
  contractNumber: string;

  @IsDateString()
  @ApiProperty({ description: 'Contract date', example: '2022-01-01' })
  contractDate: Date;

  @IsNumber()
  @ApiProperty({ description: 'Contract value', example: 120000 })
  contractValue: number;

  @IsNumber()
  @ApiProperty({ description: 'User id', example: 50 })
  userId: number;
}
