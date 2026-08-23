export type ApiMode = 'mock' | 'http';

const DEFAULT_API_BASE_URL = 'http://localhost:8080/api/v1';

const readMode = (value: string | undefined): ApiMode => {
  if (!value || value === 'mock') return 'mock';
  if (value === 'http') return 'http';
  throw new Error(`Unsupported VITE_API_MODE "${value}". Expected "mock" or "http".`);
};

export interface ApiConfig {
  mode: ApiMode;
  baseUrl: string;
}

export const apiConfig: ApiConfig = Object.freeze({
  mode: readMode(import.meta.env.VITE_API_MODE),
  baseUrl: (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/$/, ''),
});
