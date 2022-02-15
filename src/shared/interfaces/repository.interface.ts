export interface RepositoryInterface<T> {
  find(filters: Record<string, unknown>): Promise<T[]>;
  findOne(id: string): Promise<T | null>;
  create(values: Partial<T | T[]>): Promise<T | T[]>;
  update(values: Partial<T | T[]>): Promise<T | T[]>;
  delete(values: Partial<T | T[]>): Promise<void>;
}
