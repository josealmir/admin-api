import { User } from '@domain/entities/user.entity';
import { Email } from '@domain/value-objects/email';
import { UserRepository } from '@domain/repositories/user.repository';
import { CreateUserDTO } from '@application/dtos/user.dto';
import { AppError } from '@shared/errors/app-error';
import bcrypt from 'bcrypt';

export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(dto: CreateUserDTO): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new AppError('Email already in use', 409);
    }

    const email = new Email(dto.email);
    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = new User({
      name: dto.name,
      email,
      passwordHash,
    });

    return this.userRepository.create(user);
  }
}
