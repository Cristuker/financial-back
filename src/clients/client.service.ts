import { Injectable } from '@nestjs/common';
import { ClientRepository } from './client.repository';
import { CreateClientDTO } from './dto/create.client.dto';
import { UpdateClientDTO } from './dto/update.client.dto';
import { paginationNormalizer } from '@app/utils/pagination.normalize';

@Injectable()
export class ClientService {
  constructor(private readonly clientRepository: ClientRepository) {}

  async create(data: CreateClientDTO) {
    return await this.clientRepository.create(data);
  }

  async findById(id: number) {
    return await this.clientRepository.findOne(id);
  }

  async update(id: number, data: UpdateClientDTO) {
    return await this.clientRepository.update(id, data);
  }

  async listFiltered(name: string, page: number, limit: number) {
    const { limit: limitNormalized, page: pageNormalized } =
      paginationNormalizer(page, limit);
    return await this.clientRepository.listFiltered(
      name,
      pageNormalized,
      limitNormalized,
    );
  }
}
