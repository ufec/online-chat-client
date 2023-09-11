export interface ResultDto<T = any> {
  code: number;
  msg: string;
  data: T;
}

export interface PaginatedDto<TData> {
  total: number;
  list: TData[];
}
