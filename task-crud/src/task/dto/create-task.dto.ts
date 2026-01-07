import { IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { Status } from '../task.entity';

export class CreateTaskDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}
