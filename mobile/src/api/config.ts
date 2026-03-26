export type ApiDevice = 'mobile' | 'desktop' | 'w' | 'd';

type RuntimeEnv = Record<string, string | undefined>;

const runtimeEnv: RuntimeEnv =
  (globalThis as { process?: { env?: RuntimeEnv } }).process?.env ?? {};

function readEnv(name: string, fallback: string): string {
  const value = runtimeEnv[name];
  if (value == null) {
    return fallback;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, '');
}

function deriveApiOrigin(apiBasePath: string): string {
  return apiBasePath.replace(/\/api$/i, '');
}

function getHostname(url: string, fallback: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return fallback;
  }
}

function parseTimeout(value: string): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 15000;
  }

  return parsed;
}

const DEFAULT_API_BASEPATH = 'https://esportesdasorte.bet.br/api';
const apiBasePath = normalizeBaseUrl(
  readEnv('EXPO_PUBLIC_API_BASEPATH', DEFAULT_API_BASEPATH)
);
const apiOrigin = deriveApiOrigin(apiBasePath);
const fallbackDomain = getHostname(apiOrigin, 'esportesdasorte.bet.br');
const domain = readEnv('EXPO_PUBLIC_API_DOMAIN', fallbackDomain);

export interface PublicApiContext {
  domain: string;
  device: ApiDevice;
  languageCode: string;
  languageId: string;
  traderId: string;
}

export interface ApiRuntimeConfig extends PublicApiContext {
  apiBasePath: string;
  apiV2BaseUrl: string;
  referer: string;
  customOrigin: string;
  bragiUrl: string;
  timeoutMs: number;
}

export const apiConfig: ApiRuntimeConfig = {
  apiBasePath,
  apiV2BaseUrl: normalizeBaseUrl(
    readEnv('EXPO_PUBLIC_API_V2_BASEURL', `${apiOrigin}/api-v2`)
  ),
  domain,
  device: readEnv('EXPO_PUBLIC_API_DEVICE', 'mobile') as ApiDevice,
  languageCode: readEnv('EXPO_PUBLIC_API_LANGUAGE_CODE', 'pt'),
  languageId: readEnv('EXPO_PUBLIC_API_LANGUAGE_ID', '19'),
  traderId: readEnv('EXPO_PUBLIC_API_TRADER_ID', '513'),
  referer: readEnv('EXPO_PUBLIC_API_REFERER', `https://${domain}`),
  customOrigin: readEnv('EXPO_PUBLIC_API_CUSTOM_ORIGIN', `https://${domain}`),
  bragiUrl: readEnv(
    'EXPO_PUBLIC_API_BRAGI_URL',
    'http://bragi.sportingtech.com/'
  ),
  timeoutMs: parseTimeout(readEnv('EXPO_PUBLIC_API_TIMEOUT_MS', '15000')),
};

function ensureLeadingSlash(path: string): string {
  return path.startsWith('/') ? path : `/${path}`;
}

export function buildApiUrl(path: string): string {
  const sanitizedPath = ensureLeadingSlash(path).replace(/^\/api(?=\/)/i, '');
  return `${apiConfig.apiBasePath}${sanitizedPath}`;
}

export function buildApiV2Url(path: string): string {
  const sanitizedPath = ensureLeadingSlash(path).replace(
    /^\/api-v2(?=\/)/i,
    ''
  );
  return `${apiConfig.apiV2BaseUrl}${sanitizedPath}`;
}
