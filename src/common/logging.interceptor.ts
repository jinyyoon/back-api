import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url, ip, headers } = request;
    const userAgent = headers['user-agent'] || '';
    const startTime = Date.now();

    // 요청 로깅
    this.logger.log(
      `[REQUEST] ${method} ${url} - IP: ${ip} - User-Agent: ${userAgent}`,
    );

    return next.handle().pipe(
      tap((data) => {
        const { statusCode } = response;
        const contentLength = response.get('Content-Length');
        const duration = Date.now() - startTime;

        // 응답 로깅
        this.logger.log(
          `[RESPONSE] ${method} ${url} ${statusCode} - ${contentLength} bytes - ${duration}ms`,
        );

        // 에러가 있는 경우 추가 로깅
        if (statusCode >= 400) {
          this.logger.error(
            `[ERROR] ${method} ${url} ${statusCode} - Response: ${JSON.stringify(data)}`,
          );
        }
      }),
    );
  }
}
