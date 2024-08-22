import { BadRequestException, Injectable } from '@nestjs/common';
import { ContractRepository } from './contract.repository';
import { ContractDTO } from './dto/contract.dto';
import { CreateContractDTO } from './dto/create.contract.dto';
import { ClientService } from '@app/clients/client.service';

@Injectable()
export class ContractService {
  constructor(
    private readonly contractRepository: ContractRepository,
    private readonly clientService: ClientService,
  ) {}

  async create(newContract: CreateContractDTO): Promise<ContractDTO> {
    const clientDoesNotExist = await this.clientService.findById(
      newContract.clientId,
    );
    if (!clientDoesNotExist) {
      throw new BadRequestException('Client doest not exist');
    }
    const contractAlreadyExist =
      await this.contractRepository.findByContractNumber(
        newContract.contractNumber,
      );

    if (contractAlreadyExist) {
      throw new BadRequestException('Contract already exists');
    }

    return this.contractRepository.create(newContract);
  }

  async listFiltered(
    date: string,
    clientId: number,
    contractNumber: string,
    page: number,
    limit: number,
  ) {
    if (isNaN(page)) {
      page = 1;
    }

    if (isNaN(limit)) {
      limit = 10;
    }

    const contracts = await this.contractRepository.listFiltered(
      date,
      clientId,
      contractNumber,
      page,
      limit,
    );
    return this.generateStatus(contracts);
  }

  private generateStatus(contracts: ContractDTO[]) {
    return contracts.map((contract) => {
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
    });
  }

  async cancel(id: number) {
    await this.contractRepository.update(id, { canceled: true });
  }
}
