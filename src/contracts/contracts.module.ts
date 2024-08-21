import { PrismaModule } from '@app/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { ContractService } from './contract.service';
import { UsersModule } from '@app/users/users.module';
import { ContractRepository } from './contract.repository';
import { ContractController } from './contract.controller';

@Module({
  controllers: [ContractController],
  imports: [PrismaModule, UsersModule],
  providers: [ContractService, ContractRepository],
})
export class ContractsModule {}
