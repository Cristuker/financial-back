import { PrismaService } from '@app/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateContractDTO } from './dto/create.contract.dto';
import { ContractDTO } from './dto/contract.dto';
import { contractMapper } from './contract.mapper';

@Injectable()
export class ContractRepository {
  constructor(private prisma: PrismaService) {}

  async create(newContract: CreateContractDTO): Promise<ContractDTO> {
    const result = await this.prisma.contract.create({
      data: newContract,
    });
    return contractMapper(result);
  }

  async findByContractNumber(contractNumber: string): Promise<ContractDTO> {
    const result = await this.prisma.contract.findFirst({
      where: { contractNumber },
    });
    return result ? contractMapper(result) : null;
  }
}
