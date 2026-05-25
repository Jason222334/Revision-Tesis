import { Module } from '@nestjs/common';
import { AIService } from './ai.service';
import { BullModule } from '@nestjs/bullmq';
import { AnalysisProcessor } from './analysis.processor';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'analysis',
    }),
    StorageModule,
  ],
  providers: [AIService, AnalysisProcessor],
  exports: [AIService, BullModule],
})
export class AIModule {}
