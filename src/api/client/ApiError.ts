import type { ApiErrorResponse, ApiFieldError } from '../contracts/common';

export class ApiError extends Error {
  readonly code: string;
  readonly status: number;
  readonly correlationId?: string;
  readonly fieldErrors: ApiFieldError[];
  readonly retryable: boolean;

  constructor(options: {
    code: string;
    message: string;
    status?: number;
    correlationId?: string;
    fieldErrors?: ApiFieldError[];
    retryable?: boolean;
    cause?: unknown;
  }) {
    super(options.message, { cause: options.cause });
    this.name = 'ApiError';
    this.code = options.code;
    this.status = options.status ?? 0;
    this.correlationId = options.correlationId;
    this.fieldErrors = options.fieldErrors ?? [];
    this.retryable = options.retryable ?? (this.status === 0 || this.status === 429 || this.status >= 500);
  }

  static fromResponse(response: Response, payload: Partial<ApiErrorResponse> | null): ApiError {
    return new ApiError({
      code: payload?.code || `HTTP_${response.status}`,
      message: payload?.message || 'Não foi possível concluir o pedido. Tenta novamente.',
      status: response.status,
      correlationId: payload?.correlationId ?? (response.headers.get('x-correlation-id') || undefined),
      fieldErrors: payload?.fieldErrors,
    });
  }
}

export const toApiError = (error: unknown): ApiError => {
  if (error instanceof ApiError) return error;
  return new ApiError({
    code: 'NETWORK_ERROR',
    message: 'Não foi possível contactar o serviço FanScale.',
    retryable: true,
    cause: error,
  });
};
