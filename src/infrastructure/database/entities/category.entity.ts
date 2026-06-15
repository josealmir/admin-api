import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('categorys')
export class CategoryEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  description!: string;
}
