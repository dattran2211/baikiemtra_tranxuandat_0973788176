/**
 * Tests for Line98Gateway
 * - ensures gateway can be instantiated with a mocked Line98Service
 * - smoke test: gateway is defined
 */
import { Test, TestingModule } from '@nestjs/testing';
import { Line98Gateway } from './line98.gateway';
import { Line98Service } from './line98.service';

describe('Line98Gateway', () => {
  let gateway: Line98Gateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Line98Gateway,
        { provide: Line98Service, useValue: { getLatestBoard: jest.fn().mockResolvedValue(null) } },
      ],
    }).compile();

    gateway = module.get<Line98Gateway>(Line98Gateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
