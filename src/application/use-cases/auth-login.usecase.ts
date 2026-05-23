import { UserRepository } from '@domain/repositories/user.repository';
import { LoginDTO } from '@application/dtos/user.dto';
import { AppError } from '@shared/errors/app-error';
import bcrypt from 'bcrypt';

export class AuthLoginUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(dto: LoginDTO): Promise<{ id: string; name: string; email: string }> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isValid) {
      throw new AppError('Invalid credentials', 401);
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email.toString(),
    };
  }
}
