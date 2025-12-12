import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('RequestLogger');

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl, ip } = req;
    const startTime = Date.now();

    // 응답이 완료되면 로깅
    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - startTime;
      const contentLength = res.get('Content-Length') || 0;

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${duration}ms ${contentLength}bytes - ${ip}`,
      );
    });

    next();
  }
}
