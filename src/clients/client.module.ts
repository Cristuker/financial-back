import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { ClientRepository } from './client.repository';
import { ClientService } from './client.service';
import { PrismaModule } from '@app/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ClientController],
  providers: [ClientRepository, ClientService],
  exports: [ClientService],
})
export class ClientsModule {}
