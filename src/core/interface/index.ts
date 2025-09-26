export type FilterOptions = {
  sortKey?: string;
  sortDir?: 'ASC' | 'DESC';
  [key: string]: any;
};
export type PaginationOptions = {
  skip?: number;
  limit?: number;
};
