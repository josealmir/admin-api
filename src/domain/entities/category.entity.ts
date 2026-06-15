export interface CategoryProps {
  id: string;
  description: string;
}

export class Category {
  readonly id: string;
  readonly description: string;

  constructor(props: CategoryProps) {
    this.id = props.id || crypto.randomUUID();
    this.description = props.description;
  }
}
