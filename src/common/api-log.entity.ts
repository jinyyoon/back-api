import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('api_logs')
export class ApiLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  method: string;

  @Column()
  url: string;

  @Column()
  statusCode: number;

  @Column({ type: 'int', nullable: true })
  responseTime: number;

  @Column({ nullable: true })
  ip: string;

  @Column({ type: 'text', nullable: true })
  userAgent: string;

  @Column({ type: 'text', nullable: true })
  requestBody: string;

  @Column({ type: 'text', nullable: true })
  responseBody: string;

  @Column({ nullable: true })
  userId: number;

  @CreateDateColumn()
  createdAt: Date;
}
