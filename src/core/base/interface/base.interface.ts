export interface BaseServiceInterface<T> {
  findAll();
  find(id: number): Promise<T>;
  update(id: number, entity: T): Promise<T>;
  create(entity: T);
  delete(id: number);
}
