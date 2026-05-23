import { CreateUserUseCase } from '../../../src/application/use-cases/create-user.usecase';
import { UserRepository } from '../../../src/domain/repositories/user.repository';
import { User } from '../../../src/domain/entities/user.entity';
import { Email } from '../../../src/domain/value-objects/email';
import { AppError } from '../../../src/shared/errors/app-error';

const mockRepository: jest.Mocked<UserRepository> = {
  create: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new CreateUserUseCase(mockRepository);
  });

  it('should create a user successfully', async () => {
    mockRepository.findByEmail.mockResolvedValue(null);
    mockRepository.create.mockImplementation(async (user) => user);

    const result = await useCase.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    });

    expect(result.name).toBe('John Doe');
    expect(result.email.toString()).toBe('john@example.com');
    expect(mockRepository.create).toHaveBeenCalledTimes(1);
  });

  it('should throw 409 if email already exists', async () => {
    mockRepository.findByEmail.mockResolvedValue(
      new User({
        name: 'Existing',
        email: new Email('existing@example.com'),
        passwordHash: 'hash',
      }),
    );

    await expect(
      useCase.execute({
        name: 'John',
        email: 'existing@example.com',
        password: '123456',
      }),
    ).rejects.toThrow(AppError);
  });
});
