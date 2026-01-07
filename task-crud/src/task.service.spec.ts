import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from '../src/task/task.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from '../src/task/task.entity';
import { Repository } from 'typeorm';

describe('TaskService', () => {
  let service: TaskService;
  let repo: Repository<Task>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        { provide: getRepositoryToken(Task), useClass: Repository },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    repo = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
