import { CreateCategoryDTO } from '@application/dtos/category.dto';
import { CreateCategoryUseCase } from './create-category.usecase';
import { TypeORMCategoryRepository } from '@infrastructure/database/repositories/typeorm-category.repository';

const categoryRepository = new TypeORMCategoryRepository();

export function executeCreate(dto: CreateCategoryDTO) {
  return new CreateCategoryUseCase(categoryRepository).execute(dto);
}
