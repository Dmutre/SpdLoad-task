import { Global, Module } from "@nestjs/common";
import { PrismaService } from "../services/PrismaService";
import { UserRepository } from "../repository/UserRepository";


@Global()
@Module({
  providers: [PrismaService, UserRepository],
  exports: [PrismaService, UserRepository],
})
export class PrismaModule {}