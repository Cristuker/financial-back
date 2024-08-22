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
      data: {
        ...newContract,
        contractDate: new Date(newContract.contractDate),
      },
    });
    return contractMapper(result);
  }

  async findByContractNumber(contractNumber: string): Promise<ContractDTO> {
    const result = await this.prisma.contract.findFirst({
      where: { contractNumber },
    });
    return result ? contractMapper(result) : null;
  }

  async listFiltered(
    date: string,
    clientId: number,
    contractNumber: string,
    page: number,
    limit: number,
  ): Promise<ContractDTO[]> {
    const clause = {};
    date !== null ?? (clause['contractDate'] = date);
    clientId !== null ?? (clause['clientId'] = clientId);
    contractNumber !== null ?? (clause['contractNumber'] = contractNumber);

    const result = await this.prisma.contract.findMany({
      where: clause,
      take: Number(limit),
      skip: (Number(page) - 1) * Number(limit),
    });


    return result.map((contract) => {
      return contractMapper(contract);
    });
  }
}
