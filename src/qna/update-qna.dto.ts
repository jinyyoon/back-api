import { PartialType } from '@nestjs/mapped-types';
import { CreateQnaDto } from './create-qna.dto';

export class UpdateQnaDto extends PartialType(CreateQnaDto) {}
