/**
 * Tests for Line98Service
 * - verifies service can be instantiated with a mocked repository
 * - smoke test: service is defined
 */
import { Test, TestingModule } from '@nestjs/testing';
import { Line98Service } from './line98.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Line98Game } from './line98.entity';

describe('Line98Service', () => {
  let service: Line98Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Line98Service,
        { provide: getRepositoryToken(Line98Game), useValue: {} },
      ],
    }).compile();

    service = module.get<Line98Service>(Line98Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
