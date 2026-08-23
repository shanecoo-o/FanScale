export type OpaqueId = string;
export type IsoUtcTimestamp = string;
export type CurrencyCode = 'MZN';

export interface Money {
  currency: CurrencyCode;
  minorUnits: number;
}

export interface CursorPage<T> {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface CursorQuery {
  cursor?: string;
  limit?: number;
}

export interface ApiFieldError {
  field: string;
  code: string;
  message: string;
}

export interface ApiErrorResponse {
  code: string;
  message: string;
  correlationId: string;
  fieldErrors?: ApiFieldError[];
}

export interface VersionedResource {
  version: number;
}
