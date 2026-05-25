import { Module } from '@nestjs/common';
import { GeneratedThesisService } from './generated-thesis.service';
import { GeneratedThesisController } from './generated-thesis.controller';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [GeneratedThesisController],
  providers: [GeneratedThesisService],
})
export class GeneratedThesisModule {}
