import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { QnaModule } from './qna/qna.module';
import { CommonModule } from './common/common.module';
import { RequestLoggingMiddleware } from './common/request-logging.middleware';
import { User } from './user/user.entity';
import { Qna } from './qna/qna.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT ?? '3306', 10),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User, Qna],
      synchronize: true, // 개발 환경에서만 사용 (프로덕션에서는 false)
      extra: {
        allowPublicKeyRetrieval: true,
        useSSL: false,
      },
    }),
    UserModule,
    AuthModule,
    QnaModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggingMiddleware).forRoutes('*');
  }
}
