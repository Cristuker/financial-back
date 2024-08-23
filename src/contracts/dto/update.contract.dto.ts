import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateContractDTO {
  @IsBoolean()
  @IsOptional()
  @ApiProperty({ description: 'Contract canceled', example: true })
  canceled?: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Contract number', example: 12 })
  contractNumber?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Contract date',
    example: '2024-08-23T00:00:00.000Z',
  })
  contractDate?: Date;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: 'Contract value', example: 120000 })
  contractValue?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: 'Client id', example: 50 })
  clientId?: number;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ description: 'Contract payed', example: true })
  payed?: boolean;
}
