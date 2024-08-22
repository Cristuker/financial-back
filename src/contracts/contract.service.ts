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
}
