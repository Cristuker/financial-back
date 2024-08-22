import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ContractsModule } from './contracts/contracts.module';
import { ClientsModule } from './clients/client.module';

@Module({
  imports: [UsersModule, AuthModule, ContractsModule, ClientsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
