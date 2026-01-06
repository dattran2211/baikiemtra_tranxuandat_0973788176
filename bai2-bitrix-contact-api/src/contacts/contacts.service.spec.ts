import { Test, TestingModule } from '@nestjs/testing';
import { ContactsService } from './contacts.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ContactsService', () => {
  let service: ContactsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactsService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'BITRIX24_WEBHOOK') {
                return 'https://test.bitrix24.vn/rest/1/testkey/';
              }
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<ContactsService>(ContactsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return contacts list successfully', async () => {
    const mockContacts = [
      { ID: '1', NAME: 'Test Contact 1' },
      { ID: '2', NAME: 'Test Contact 2' },
    ];

    mockedAxios.get.mockResolvedValueOnce({
      data: { result: mockContacts },
    });

    const result = await service.getContacts();

    expect(mockedAxios.get).toHaveBeenCalledWith('https://test.bitrix24.vn/rest/1/testkey/crm.contact.list');
    expect(result).toEqual(mockContacts);
  });

  it('should handle error when getting contacts', async () => {
    mockedAxios.get.mockRejectedValueOnce({
      response: { data: 'API Error' },
    });

    await expect(service.getContacts()).rejects.toThrow('API Error');
  });

  it('should create contact successfully', async () => {
    const createDto = {
      name: 'Test Contact',
      email: 'test@example.com',
      phone: '0123456789',
    };

    mockedAxios.post
      .mockResolvedValueOnce({ data: { result: 123 } }) // contact.add
      .mockResolvedValueOnce({ data: { result: 456 } }); // requisite.add (optional)

    const result = await service.createContact(createDto);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://test.bitrix24.vn/rest/1/testkey/crm.contact.add',
      {
        fields: {
          NAME: 'Test Contact',
          ADDRESS: undefined,
          PHONE: [{ VALUE: '0123456789', VALUE_TYPE: 'WORK' }],
          EMAIL: [{ VALUE: 'test@example.com', VALUE_TYPE: 'WORK' }],
          WEB: [{ VALUE: undefined, VALUE_TYPE: 'WORK' }],
        },
      }
    );
    expect(result).toEqual({ contactId: 123 });
  });

  it('should create contact with bank info', async () => {
    const createDto = {
      name: 'Test Contact',
      bank_name: 'Test Bank',
      bank_account: '123456789',
    };

    mockedAxios.post
      .mockResolvedValueOnce({ data: { result: 123 } }) // contact.add
      .mockResolvedValueOnce({ data: { result: 456 } }); // requisite.add

    const result = await service.createContact(createDto);

    expect(mockedAxios.post).toHaveBeenCalledTimes(2);
    expect(mockedAxios.post).toHaveBeenNthCalledWith(
      2,
      'https://test.bitrix24.vn/rest/1/testkey/crm.requisite.add',
      {
        fields: {
          ENTITY_ID: 123,
          ENTITY_TYPE_ID: 3,
          NAME: 'Test Bank',
          PRESET_ID: 1,
          ACTIVE: 'Y',
        },
      }
    );
    expect(result).toEqual({ contactId: 123 });
  });

  it('should handle error when creating contact', async () => {
    const createDto = {
      name: 'Test Contact',
    };

    mockedAxios.post.mockRejectedValueOnce({
      response: { data: 'Create Error' },
    });

    await expect(service.createContact(createDto)).rejects.toThrow('Create Error');
  });

  it('should update contact successfully', async () => {
    const updateDto = {
      name: 'Updated Contact',
      email: 'updated@example.com',
    };

    mockedAxios.post.mockResolvedValueOnce({
      data: { result: true },
    });

    const result = await service.updateContact(123, updateDto);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://test.bitrix24.vn/rest/1/testkey/crm.contact.update',
      {
        id: 123,
        fields: {
          NAME: 'Updated Contact',
          ADDRESS: undefined,
          PHONE: [{ VALUE: undefined, VALUE_TYPE: 'WORK' }],
          EMAIL: [{ VALUE: 'updated@example.com', VALUE_TYPE: 'WORK' }],
          WEB: [{ VALUE: undefined, VALUE_TYPE: 'WORK' }],
        },
      }
    );
    expect(result).toEqual({ message: 'Updated' });
  });

  it('should handle error when updating contact', async () => {
    const updateDto = {
      name: 'Updated Contact',
    };

    mockedAxios.post.mockRejectedValueOnce({
      response: { data: 'Update Error' },
    });

    await expect(service.updateContact(123, updateDto)).rejects.toThrow('Update Error');
  });

  it('should delete contact successfully', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { result: true },
    });

    const result = await service.deleteContact(123);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://test.bitrix24.vn/rest/1/testkey/crm.contact.delete',
      { id: 123 }
    );
    expect(result).toEqual({ message: 'Deleted' });
  });

  it('should handle error when deleting contact', async () => {
    mockedAxios.post.mockRejectedValueOnce({
      response: { data: 'Delete Error' },
    });

    await expect(service.deleteContact(123)).rejects.toThrow('Delete Error');
  });
});
