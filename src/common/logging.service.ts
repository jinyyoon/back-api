import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiLog } from './api-log.entity';

@Injectable()
export class LoggingService {
  constructor(
    @InjectRepository(ApiLog)
    private readonly apiLogRepository: Repository<ApiLog>,
  ) {}

  async logApiCall(logData: Partial<ApiLog>): Promise<void> {
    const log = this.apiLogRepository.create(logData);
    await this.apiLogRepository.save(log);
  }
}
