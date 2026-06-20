import { Category } from '@domain/entities/category.entity';
import { CategoryRepository } from '@domain/repositories/category.repository';

export class FindCategoryByIdUseCase {
  constructor(private readonly categoryReposiotry: CategoryRepository) {}

  async execute(id: string): Promise<Category | null> {
    const category = await this.categoryReposiotry.findById(id);
    return category;
  }
}
