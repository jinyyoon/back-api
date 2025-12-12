import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Qna } from './qna.entity';
import { CreateQnaDto } from './create-qna.dto';
import { UpdateQnaDto } from './update-qna.dto';
import { PaginationDto, PaginatedResult } from './pagination.dto';

@Injectable()
export class QnaService {
  constructor(
    @InjectRepository(Qna)
    private readonly qnaRepository: Repository<Qna>,
  ) {}

  async create(createQnaDto: CreateQnaDto): Promise<Qna> {
    const qna = this.qnaRepository.create(createQnaDto);
    return await this.qnaRepository.save(qna);
  }

  async findAll(paginationDto?: PaginationDto): Promise<Qna[] | PaginatedResult<Qna>> {
    if (!paginationDto) {
      return await this.qnaRepository.find({
        where: { delYN: 'N' },
        order: { createdAt: 'DESC' }
      });
    }

    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [data, total] = await this.qnaRepository.findAndCount({
      where: { delYN: 'N' },
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async findOne(no: number): Promise<Qna> {
    const qna = await this.qnaRepository.findOne({ where: { no } });
    if (!qna) {
      throw new NotFoundException(`Qna with NO ${no} not found`);
    }
    return qna;
  }

  async findByUserId(id: number, paginationDto?: PaginationDto): Promise<Qna[] | PaginatedResult<Qna>> {
    if (!paginationDto) {
      return await this.qnaRepository.find({
        where: { id, delYN: 'N' },
        order: { createdAt: 'DESC' }
      });
    }

    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [data, total] = await this.qnaRepository.findAndCount({
      where: { id, delYN: 'N' },
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async update(no: number, updateQnaDto: UpdateQnaDto): Promise<Qna> {
    const qna = await this.findOne(no);
    Object.assign(qna, updateQnaDto);
    return await this.qnaRepository.save(qna);
  }

  async remove(no: number): Promise<void> {
    const qna = await this.findOne(no);
    qna.delYN = 'Y';
    await this.qnaRepository.save(qna);
  }

  async hardDelete(no: number): Promise<void> {
    const qna = await this.findOne(no);
    await this.qnaRepository.remove(qna);
  }
}
