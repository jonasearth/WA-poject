export interface Repository<T> {
  find(): Promise<T[]>;
  findOneOrFail(id: number): Promise<T>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  save(values: object): Promise<T>;
  delete(id: number): Promise<void>;
}
