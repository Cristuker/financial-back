import { Decimal } from '@prisma/client/runtime/library';
import { ContractStatus } from '../types/status';

export class ContractDTO {
  id: number;
  contractNumber: string;
  contractDate: Date;
  contractValue: number | Decimal;
  clientId: number;
  status?: ContractStatus;
  canceled: boolean;
}
