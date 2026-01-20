export type ApiError = {
  message: string;
  status: number;
  path: string;
  timestamp: Date;
  data?: unknown;
};
