import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
  ) {}

  create(createTaskDto: CreateTaskDto) {
    const task = this.taskRepo.create(createTaskDto);
    return this.taskRepo.save(task);
  }

  findAll() {
    return this.taskRepo.find();
  }

  async findOne(id: string) {
    const task = await this.taskRepo.findOne({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.findOne(id);
    Object.assign(task, updateTaskDto);
    return this.taskRepo.save(task);
  }

  async remove(id: string) {
    const task = await this.findOne(id);
    return this.taskRepo.remove(task);
  }
}
