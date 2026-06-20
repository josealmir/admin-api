import { Category } from '@domain/entities/category.entity';
import { CategoryRepository } from '@domain/repositories/category.repository';
import { CategoryEntity } from '../entities/category.entity';
import { Repository } from 'typeorm';
import { AppDataSource } from '../typeorm.config';
import { Content } from '../entities/content.entity';

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

  async findAll(): Promise<Category[]> {
    const entities = await this.repo.find();
    return entities.map(this.toDomain.bind(this));
  }

  async findPaginated(size: number = 10): Promise<Content<Category>> {
    const [entities, total] = await this.repo.findAndCount({ take: size });
    return { data: entities.map(this.toDomain.bind(this)), total };
  }

  async update(id: string, entity: Partial<Category>): Promise<Category | null> {
    await this.repo.update(id, { description: entity.description });
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
