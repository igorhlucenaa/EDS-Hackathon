import { apiConfig } from './config';

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string | undefined>;
  body?: unknown;
  timeoutMs?: number;
}

export class ApiRequestError extends Error {
  readonly status: number;
  readonly url: string;
  readonly details: unknown;

  constructor(message: string, status: number, url: string, details?: unknown) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.url = url;
    this.details = details;
  }
}

function sanitizeHeaders(
  headers: Record<string, string | undefined>
): Record<string, string> {
  const cleaned: Record<string, string> = {};

  Object.entries(headers).forEach(([key, value]) => {
    if (value != null && value.trim().length > 0) {
      cleaned[key] = value;
    }
  });

  return cleaned;
}

function parseBody(responseText: string): unknown {
  if (responseText.length === 0) {
    return null;
  }

  try {
    return JSON.parse(responseText);
  } catch {
    return responseText;
  }
}

export async function requestJson<T>(
  url: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const controller = new AbortController();
  const timeoutMs = options.timeoutMs ?? apiConfig.timeoutMs;
  const timeoutHandle = setTimeout(() => controller.abort(), timeoutMs);

  const headers = sanitizeHeaders({
    Accept: 'application/json',
    ...(options.headers ?? {}),
  });

  let requestBody: BodyInit | undefined;
  if (options.body != null) {
    if (typeof options.body === 'string') {
      requestBody = options.body;
    } else {
      requestBody = JSON.stringify(options.body);
      if (!headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
      }
    }
  }

  try {
    const response = await fetch(url, {
      method: options.method ?? 'GET',
      headers,
      body: requestBody,
      signal: controller.signal,
    });

    const responseText = await response.text();
    const parsedBody = parseBody(responseText);

    if (!response.ok) {
      throw new ApiRequestError(
        `Request failed with status ${response.status}`,
        response.status,
        url,
        parsedBody
      );
    }

    return parsedBody as T;
  } catch (error) {
    if (error instanceof ApiRequestError) {
      throw error;
    }

    if ((error as { name?: string }).name === 'AbortError') {
      throw new ApiRequestError('Request timeout', 408, url);
    }

    throw new ApiRequestError('Network request failed', 0, url, error);
  } finally {
    clearTimeout(timeoutHandle);
  }
}
