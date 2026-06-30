export interface ApiSuccessResponse<T> {
  data: T;
}

export interface ApiErrorBody {
  error: string;
  message: string;
  statusCode: number;
}
