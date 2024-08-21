import { Module } from '@nestjs/common';
import { PrismaModule } from '@app/prisma/prisma.module';

@Module({
  controllers: [],
  providers: [],
  imports: [PrismaModule],
})
export class UsersModule {}
