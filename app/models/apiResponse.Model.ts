export interface ApiResponse<T> {
  isSuccess: boolean;
  responseCode: number;
  data: T;
}
