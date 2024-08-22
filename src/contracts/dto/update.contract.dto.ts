import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class UpdateContractDTO {
  @IsBoolean()
  canceled?: boolean;

  @IsString()
  contractNumber?: string;

  @IsString()
  contractDate?: Date;

  @IsNumber()
  contractValue?: number;

  @IsNumber()
  clientId?: number;
}
