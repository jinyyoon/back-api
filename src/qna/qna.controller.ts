import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { QnaService } from './qna.service';
import { CreateQnaDto } from './create-qna.dto';
import { UpdateQnaDto } from './update-qna.dto';
import { PaginationDto, PaginatedResult } from './pagination.dto';
import { Qna } from './qna.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('qna')
export class QnaController {
  constructor(private readonly qnaService: QnaService) {}

  @Post()
  create(@Body() createQnaDto: CreateQnaDto): Promise<Qna> {
    return this.qnaService.create(createQnaDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() paginationDto?: PaginationDto): Promise<Qna[] | PaginatedResult<Qna>> {
    return this.qnaService.findAll(paginationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:id')
  findByUserId(
    @Param('id', ParseIntPipe) id: number,
    @Query() paginationDto?: PaginationDto,
  ): Promise<Qna[] | PaginatedResult<Qna>> {
    return this.qnaService.findByUserId(id, paginationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':no')
  findOne(@Param('no', ParseIntPipe) no: number): Promise<Qna> {
    return this.qnaService.findOne(no);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':no')
  update(
    @Param('no', ParseIntPipe) no: number,
    @Body() updateQnaDto: UpdateQnaDto,
  ): Promise<Qna> {
    return this.qnaService.update(no, updateQnaDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':no')
  remove(@Param('no', ParseIntPipe) no: number): Promise<void> {
    return this.qnaService.remove(no);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':no/hard')
  hardDelete(@Param('no', ParseIntPipe) no: number): Promise<void> {
    return this.qnaService.hardDelete(no);
  }
}
