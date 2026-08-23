import { ApiError, toApiError } from './ApiError';

type QueryValue = string | number | boolean | null | undefined;

export interface ApiRequestOptions<TBody = unknown> {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  query?: Record<string, QueryValue | QueryValue[]>;
  body?: TBody;
  headers?: Record<string, string>;
  authToken?: string;
  idempotencyKey?: string;
  correlationId?: string;
  signal?: AbortSignal;
}

export interface ApiClientOptions {
  baseUrl: string;
  fetchImplementation?: typeof fetch;
  getAuthToken?: () => string | undefined | Promise<string | undefined>;
  createCorrelationId?: () => string;
}

const defaultCorrelationId = () =>
  globalThis.crypto?.randomUUID?.() ?? `web-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export class ApiClient {
  private readonly baseUrl: string;
  private readonly fetchImplementation: typeof fetch;
  private readonly getAuthToken?: ApiClientOptions['getAuthToken'];
  private readonly createCorrelationId: () => string;

  constructor(options: ApiClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, '');
    this.fetchImplementation = options.fetchImplementation ?? fetch;
    this.getAuthToken = options.getAuthToken;
    this.createCorrelationId = options.createCorrelationId ?? defaultCorrelationId;
  }

  async request<TResponse, TBody = unknown>(options: ApiRequestOptions<TBody>): Promise<TResponse> {
    const token = options.authToken ?? await this.getAuthToken?.();
    const correlationId = options.correlationId ?? this.createCorrelationId();
    const url = new URL(`${this.baseUrl}/${options.path.replace(/^\//, '')}`);

    Object.entries(options.query ?? {}).forEach(([key, rawValue]) => {
      const values = Array.isArray(rawValue) ? rawValue : [rawValue];
      values.forEach((value) => {
        if (value !== undefined && value !== null) url.searchParams.append(key, String(value));
      });
    });

    const headers = new Headers(options.headers);
    headers.set('Accept', 'application/json');
    headers.set('X-Correlation-ID', correlationId);
    if (token) headers.set('Authorization', `Bearer ${token}`);
    if (options.idempotencyKey) headers.set('Idempotency-Key', options.idempotencyKey);
    if (options.body !== undefined) headers.set('Content-Type', 'application/json');

    try {
      const response = await this.fetchImplementation(url, {
        method: options.method ?? 'GET',
        headers,
        body: options.body === undefined ? undefined : JSON.stringify(options.body),
        signal: options.signal,
      });
      const hasJson = response.headers.get('content-type')?.includes('application/json');
      const payload = hasJson ? await response.json() : null;
      if (!response.ok) throw ApiError.fromResponse(response, payload);
      return payload as TResponse;
    } catch (error) {
      throw toApiError(error);
    }
  }
}
