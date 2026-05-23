import { Repository } from 'typeorm';
import { AppDataSource } from '@infrastructure/database/typeorm.config';
import { UserEntity } from '@infrastructure/database/entities/user.entity';
import { User } from '@domain/entities/user.entity';
import { Email } from '@domain/value-objects/email';
import { UserRepository } from '@domain/repositories/user.repository';

export class TypeORMUserRepository implements UserRepository {
  private readonly repo: Repository<UserEntity>;

  constructor() {
    this.repo = AppDataSource.getRepository(UserEntity);
  }

  private toDomain(entity: UserEntity): User {
    return new User({
      id: entity.id,
      name: entity.name,
      email: new Email(entity.email),
      passwordHash: entity.passwordHash,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  private toPersistence(user: User): UserEntity {
    const entity = new UserEntity();
    entity.id = user.id;
    entity.name = user.name;
    entity.email = user.email.toString();
    entity.passwordHash = user.passwordHash;
    entity.createdAt = user.createdAt;
    entity.updatedAt = user.updatedAt;
    return entity;
  }

  async create(user: User): Promise<User> {
    const entity = this.toPersistence(user);
    const saved = await this.repo.save(entity);
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<User | null> {
    const entity = await this.repo.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.repo.findOne({ where: { email } });
    return entity ? this.toDomain(entity) : null;
  }

  async findAll(): Promise<User[]> {
    const entities = await this.repo.find();
    return entities.map((e) => this.toDomain(e));
  }

  async update(id: string, _user: Partial<User>): Promise<User | null> {
    await this.repo.update(id, { name: _user.name });
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
