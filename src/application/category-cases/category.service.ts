import { CreateCategoryDTO } from '@application/dtos/category.dto';
import { CreateCategoryUseCase } from './create-category.usecase';
import { TypeORMCategoryRepository } from '@infrastructure/database/repositories/typeorm-category.repository';
import { FindCategoryByIdUseCase } from './find-by-id.usecase';
import { DeleteCategoryUseCase } from './delete.usecase';
import { UpdateCategoryUseCase } from './update.usecase';

const categoryRepository = new TypeORMCategoryRepository();

export function executeCreate(dto: CreateCategoryDTO) {
  return new CreateCategoryUseCase(categoryRepository).execute(dto);
}

export function executeFindById(id: string) {
  return new FindCategoryByIdUseCase(categoryRepository).execute(id);
}

export function executeUpdate(id: string, description: string) {
  return new UpdateCategoryUseCase(categoryRepository).execute(id, description);
}

export function executeDelete(id: string) {
  return new DeleteCategoryUseCase(categoryRepository).execute(id);
}

export function executeFindAll() {
  return categoryRepository.findAll();
}
