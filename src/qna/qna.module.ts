import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QnaService } from './qna.service';
import { QnaController } from './qna.controller';
import { Qna } from './qna.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Qna])],
  controllers: [QnaController],
  providers: [QnaService],
  exports: [QnaService],
})
export class QnaModule {}
