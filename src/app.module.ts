import { Module } from '@nestjs/common';
import { PrismaModule } from './api/modules/PrismaModule';
import { AuthModule } from './api/modules/AuthModule';
import { MailModule } from './api/modules/MailModule';

@Module({
  imports: [PrismaModule, AuthModule, MailModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
