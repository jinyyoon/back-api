import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('qna')
export class Qna {
  @PrimaryGeneratedColumn()
  no: number;

  @Column({ type: 'int', nullable: true })
  id: number;

  @Column({ length: 50, nullable: true })
  inputId: string;

  @Column({ length: 200, nullable: true })
  email: string;

  @Column({ length: 20, nullable: true })
  hp: string;

  @Column({ type: 'text', nullable: true })
  contents: string;

  @Column({ type: 'text', nullable: true })
  answer: string;

  @Column({ length: 1, default: 'N' })
  answerYN: string;

  @Column({ length: 20, nullable: true })
  ip: string;

  @Column({ length: 1, default: 'N' })
  delYN: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
