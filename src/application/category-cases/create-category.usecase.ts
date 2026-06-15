import { CreateCategoryDTO } from '@application/dtos/category.dto';
import { Category } from '@domain/entities/category.entity';
import { CategoryRepository } from '@domain/repositories/category.repository';

export class CreateCategoryUseCase {
  constructor(private readonly categoryReposiotry: CategoryRepository) {}

  async execute(dto: CreateCategoryDTO): Promise<Category> {
    const category = new Category({
      id: '',
      description: dto.description,
    });
    const newCategory = await this.categoryReposiotry.create(category);
    return newCategory;
  }
}
