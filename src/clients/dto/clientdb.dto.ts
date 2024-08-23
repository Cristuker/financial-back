import { ContractDTO } from '@app/contracts/dto/contract.dto';

export class ClientDBDTO {
  id: number;
  name: string;
  cpfCnpj: string;
  phoneNumber: string;
  contracts: ContractDTO[];
}
