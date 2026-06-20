import { Category } from '@domain/entities/category.entity';
import { CategoryRepository } from '@domain/repositories/category.repository';

export class UpdateCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(id: string, description: string): Promise<Category | null> {
    let category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new Error('Category not found');
    }
    category = new Category({ id, description });

    const updatedCategory = await this.categoryRepository.update(id, category);
    return updatedCategory;
  }
}
