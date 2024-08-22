import { BadRequestException, Injectable } from '@nestjs/common';
import { ContractRepository } from './contract.repository';
import { ContractDTO } from './dto/contract.dto';
import { CreateContractDTO } from './dto/create.contract.dto';
import { UserService } from '@app/users/user.service';

@Injectable()
export class ContractService {
  constructor(
    private readonly contractRepository: ContractRepository,
    private readonly usersService: UserService,
  ) {}

  async create(newContract: CreateContractDTO): Promise<ContractDTO> {
    // TODO: Verificar cliente
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
