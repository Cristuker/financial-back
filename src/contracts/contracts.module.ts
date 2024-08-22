import { PrismaModule } from '@app/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { ContractService } from './contract.service';
import { ContractRepository } from './contract.repository';
import { ContractController } from './contract.controller';
import { ClientsModule } from '@app/clients/client.module';

@Module({
  controllers: [ContractController],
  imports: [PrismaModule, ClientsModule],
  providers: [ContractService, ContractRepository],
})
export class ContractsModule {}
