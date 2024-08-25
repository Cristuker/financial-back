import { BadRequestException, Injectable } from '@nestjs/common';
import { ContractRepository } from './contract.repository';
import { ContractDTO } from './dto/contract.dto';
import { CreateContractDTO } from './dto/create.contract.dto';
import { ClientService } from '@app/clients/client.service';
import { UpdateContractDTO } from './dto/update.contract.dto';
import { paginationNormalizer } from '@app/utils/pagination.normalize';
import { generateStatusLot } from '@app/utils/generateStatus';

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
    const { limit: limitNormalized, page: pageNormalized } =
      paginationNormalizer(page, limit);

    const contracts = await this.contractRepository.listFiltered(
      date,
      clientId,
      contractNumber,
      pageNormalized,
      limitNormalized,
    );
    return generateStatusLot(contracts);
  }

  async cancel(id: number) {
    await this.contractRepository.update(id, { canceled: true });
  }

  async removeClient(id: number) {
    await this.contractRepository.update(id, { clientId: null });
  }

  async update(id: number, data: UpdateContractDTO) {
    return await this.contractRepository.update(id, data);
  }

  async findByClientId(id: any) {
    return await this.contractRepository.findByClientId(id);
  }

  async pay(id: number) {
    await this.contractRepository.update(id, { payed: true });
  }
}
