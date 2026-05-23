import { AuthLoginUseCase } from '@application/use-cases/auth-login.usecase';
import { UserRepository } from '@domain/repositories/user.repository';
import { User } from '@domain/entities/user.entity';
import { Email } from '@domain/value-objects/email';
import { AppError } from '@shared/errors/app-error';
import bcrypt from 'bcrypt';

const mockRepository: jest.Mocked<UserRepository> = {
  create: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('AuthLoginUseCase', () => {
  let useCase: AuthLoginUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new AuthLoginUseCase(mockRepository);
  });

  it('should return user on valid credentials', async () => {
    const passwordHash = await bcrypt.hash('correct-password', 10);
    mockRepository.findByEmail.mockResolvedValue(
      new User({
        name: 'John',
        email: new Email('john@example.com'),
        passwordHash,
      }),
    );

    const result = await useCase.execute({
      email: 'john@example.com',
      password: 'correct-password',
    });

    expect(result.email).toBe('john@example.com');
  });

  it('should throw 401 on invalid password', async () => {
    const passwordHash = await bcrypt.hash('correct-password', 10);
    mockRepository.findByEmail.mockResolvedValue(
      new User({
        name: 'John',
        email: new Email('john@example.com'),
        passwordHash,
      }),
    );

    await expect(
      useCase.execute({
        email: 'john@example.com',
        password: 'wrong-password',
      }),
    ).rejects.toThrow(AppError);
  });

  it('should throw 401 if user not found', async () => {
    mockRepository.findByEmail.mockResolvedValue(null);

    await expect(
      useCase.execute({
        email: 'notfound@example.com',
        password: 'any',
      }),
    ).rejects.toThrow(AppError);
  });
});
