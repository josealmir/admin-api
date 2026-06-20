export class Content<T> {
  constructor(
    public readonly data: T[],
    public readonly total: number,
  ) {}
}
