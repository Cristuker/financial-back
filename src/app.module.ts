import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ContractsModule } from './contracts/contracts.module';

@Module({
  imports: [UsersModule, AuthModule, ContractsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
