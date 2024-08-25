import { ContractDTO } from '@app/contracts/dto/contract.dto';

export const generateStatusLot = (contracts: ContractDTO[]) => {
  return contracts.map((contract) => generateStatus(contract));
};

export const generateStatus = (contract: ContractDTO) => {
  if (contract.canceled) {
    contract.status = 'Cancelados';
    return contract;
  }
  if (contract.contractDate > new Date()) {
    contract.status = 'Em Atraso';
    return contract;
  }
  if (contract.contractDate < new Date()) {
    contract.status = 'Dentro do Prazo';
    return contract;
  }
};
