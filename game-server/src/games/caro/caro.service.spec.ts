/**
 * Tests for CaroService
 * - verifies service instantiates with a mocked repository
 */
import { Test, TestingModule } from '@nestjs/testing';
import { CaroService } from './caro.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CaroMatch } from './caro.entity';

describe('CaroService', () => {
  let service: CaroService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CaroService,
        { provide: getRepositoryToken(CaroMatch), useValue: {} },
      ],
    }).compile();

    service = module.get<CaroService>(CaroService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
