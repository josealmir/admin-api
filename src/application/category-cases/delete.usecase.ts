import { CategoryRepository } from '@domain/repositories/category.repository';

export class DeleteCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(id: string): Promise<void> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new Error('Category not found');
    }
    await this.categoryRepository.delete(id);
  }
}
