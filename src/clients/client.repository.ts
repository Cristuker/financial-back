import { PrismaService } from '@app/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateClientDTO } from './dto/create.client.dto';
import { UpdateClientDTO } from './dto/update.client.dto';
import { clientMapper } from './client.mapper';

@Injectable()
export class ClientRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateClientDTO) {
    return await this.prismaService.client.create({
      data,
    });
  }

  async findAll() {
    return await this.prismaService.client.findMany();
  }

  async findOne(id: number) {
    return await this.prismaService.client.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: UpdateClientDTO) {
    return await this.prismaService.client.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<void> {
    await this.prismaService.client.delete({
      where: { id },
    });
  }

  async listFiltered(name: string, page: number, limit: number) {
    const result = await this.prismaService.client.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
      take: Number(limit),
      skip: (Number(page) - 1) * Number(limit),
      include: {
        contracts: {
          select: {
            id: true,
            contractNumber: true,
            contractDate: true,
            contractValue: true,
            clientId: true,
            canceled: true,
          },
        },
      },
    });

    return result.map((client) => clientMapper(client));
  }
}
