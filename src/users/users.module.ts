import { Module } from '@nestjs/common';
import { PrismaModule } from '@app/prisma/prisma.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository],
  imports: [PrismaModule],
})
export class UsersModule {}
