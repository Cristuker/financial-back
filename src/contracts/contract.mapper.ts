import { Contract } from '@prisma/client';
import { ContractDTO } from './dto/contract.dto';

export const contractMapper = (contract: Contract): ContractDTO => {
  return {
    id: contract.id,
    contractNumber: contract.contractNumber,
    contractDate: contract.contractDate,
    contractValue: Number(contract.contractValue),
    clientId: contract.clientId,
    canceled: contract.canceled,
  };
};
