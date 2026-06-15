import { Category } from '@domain/entities/category.entity';
import { CategoryRepository } from '@domain/repositories/category.repository';
import { CategoryEntity } from '../entities/category.entity';
import { Repository } from 'typeorm';
import { AppDataSource } from '../typeorm.config';

export class TypeORMCategoryRepository implements CategoryRepository {
  private readonly repo: Repository<CategoryEntity>;

  constructor() {
    this.repo = AppDataSource.getRepository(CategoryEntity);
  }

  private toDomain(entity: CategoryEntity): Category {
    return new Category({
      id: entity.id,
      description: entity.description,
    });
  }

  private toPersistence(category: Category): CategoryEntity {
    return {
      id: category.id,
      description: category.description,
    };
  }

  async create(entity: Category): Promise<Category> {
    const category = this.toPersistence(entity);
    const saved = await this.repo.save(category);
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<Category | null> {
    const entity = await this.repo.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  findAll(): Promise<Category[]> {
    throw new Error('Method not implemented.');
  }

  update(id: string, entity: Partial<Category>): Promise<Category | null> {
    throw new Error('Method not implemented.');
  }

  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
