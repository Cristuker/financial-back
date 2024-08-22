import { Injectable } from '@nestjs/common';
import { ClientRepository } from './client.repository';
import { CreateClientDTO } from './dto/create.client.dto';

@Injectable()
export class ClientService {
  constructor(private readonly clientRepository: ClientRepository) {}

  async create(data: CreateClientDTO) {
    return this.clientRepository.create(data);
  }

  async findByEmail(email: string) {
    return this.clientRepository.findByEmail(email);
  }
}
