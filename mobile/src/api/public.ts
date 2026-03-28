import { type ApiDevice, apiConfig, buildApiUrl, buildApiV2Url } from './config';
import { requestJson } from './http';

export interface ApiResponseCode {
  responseCode: number;
  responseKey: string;
  responseMessage?: string;
}

export interface ApiEnvelope<T> {
  success: boolean;
  responseCodes: ApiResponseCode[];
  data: T;
  message?: string;
}

export interface WebMultilanguageItem {
  multilanguageId: number;
  typeName: string;
  key: string;
  value: string;
  languageId: number;
  traderId: number;
}

export interface ApplicationParameterItem {
  parameter: string;
  parameterDescription?: string;
  value: string;
}

export interface TraderDefaultsData {
  traderId?: number;
  [key: string]: unknown;
}

export interface TraderPageMaster {
  traderPageMasterId: number;
  pageCode: string;
  description: string;
}

export interface TraderPageItem {
  traderPageTitleAndMetaId?: number;
  traderId?: number;
  languageId?: number;
  device?: string;
  metas?: string;
  traderPageMasterIdKey?: number;
  traderPageMaster?: TraderPageMaster;
}

export interface TodaySportTypeItem {
  stId: number;
  xid?: string;
  stN: string;
  iconId?: number;
  pid?: number;
  mdt?: number;
  lvt?: boolean;
  fCnt?: number;
  oCnt?: number;
  aCnt?: number;
  fCM?: number;
  oCM?: number;
  stSURL?: string;
}

export interface BetTypeGroupResponseItem {
  sportTypeId: number;
  betTypeGroupMarkets: Array<{
    betTypeGroupMarketId: number;
    betTypeGroupMarketName: string;
    betTypeGroups: Array<{
      betTypeGroupId: number;
      betTypeGroupName: string;
      mainBtgName?: string;
      orderBy?: number;
      promoted?: boolean;
      [key: string]: unknown;
    }>;
  }>;
}

export interface FixtureOddNode {
  foId: number;
  btId?: number;
  btN?: string;
  valid?: boolean;
  hO?: number;
  pO?: number;
  aO?: number;
  oc?: string;
  [key: string]: unknown;
}

export interface FixtureNode {
  fId?: number;
  fN?: string;
  hCN?: string;
  aCN?: string;
  btgs?: Array<{
    btgId?: number;
    btgN?: string;
    fos?: FixtureOddNode[];
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
}

export interface FixtureSeasonNode {
  ssnId?: number;
  ssnN?: string;
  fs?: FixtureNode[];
  [key: string]: unknown;
}

export interface FixtureCategoryNode {
  cId?: number;
  cN?: string;
  sns?: FixtureSeasonNode[];
  [key: string]: unknown;
}

export interface FixtureTreeNode {
  stId?: number;
  stN?: string;
  cs?: FixtureCategoryNode[];
  [key: string]: unknown;
}

export interface ApiV2RequestBody {
  timeRangeInHours: number;
  startDate: number;
}

export interface PublicApiOptions {
  domain?: string;
  device?: ApiDevice;
  languageCode?: string;
  languageId?: string;
  traderId?: string;
  referer?: string;
  customOrigin?: string;
  bragiUrl?: string;
}

interface ResolvedPublicApiOptions {
  domain: string;
  device: ApiDevice;
  languageCode: string;
  languageId: string;
  traderId: string;
  referer: string;
  customOrigin: string;
  bragiUrl: string;
}

function resolveOptions(options?: PublicApiOptions): ResolvedPublicApiOptions {
  return {
    domain: options?.domain ?? apiConfig.domain,
    device: options?.device ?? apiConfig.device,
    languageCode: options?.languageCode ?? apiConfig.languageCode,
    languageId: options?.languageId ?? apiConfig.languageId,
    traderId: options?.traderId ?? apiConfig.traderId,
    referer: options?.referer ?? apiConfig.referer,
    customOrigin: options?.customOrigin ?? apiConfig.customOrigin,
    bragiUrl: options?.bragiUrl ?? apiConfig.bragiUrl,
  };
}

function toUtf8Base64(value: string): string {
  const encodedForBtoa = encodeURIComponent(value).replace(
    /%([0-9A-F]{2})/g,
    (_, hex: string) => String.fromCharCode(parseInt(hex, 16))
  );

  if (typeof globalThis.btoa === 'function') {
    return globalThis.btoa(encodedForBtoa);
  }

  const bufferCtor = (
    globalThis as {
      Buffer?: {
        from: (
          data: string,
          encoding?: string
        ) => { toString: (encoding: string) => string };
      };
    }
  ).Buffer;

  if (bufferCtor) {
    return bufferCtor.from(value, 'utf8').toString('base64');
  }

  throw new Error('No base64 encoder available in runtime');
}

function buildApiV2Headers(
  context: ResolvedPublicApiOptions,
  requestBody: ApiV2RequestBody
): Record<string, string> {
  const payload = toUtf8Base64(JSON.stringify({ requestBody }));

  return {
    encodedbody: payload,
    languageid: context.languageId,
    device: context.device,
    customorigin: context.customOrigin,
    origin: context.customOrigin,
    referer: context.referer,
    bragiurl: context.bragiUrl,
  };
}

function getDefaultApiV2Body(): ApiV2RequestBody {
  return {
    timeRangeInHours: 24,
    startDate: Date.now(),
  };
}

// Generic API (/api/...) - does not require login/session for these endpoints.
export async function getWebMultilanguages(options?: PublicApiOptions) {
  const context = resolveOptions(options);
  const url = buildApiUrl(
    `/api/generic/getWebMultilanguages/${encodeURIComponent(
      context.domain
    )}/${encodeURIComponent(context.languageCode)}`
  );

  return requestJson<ApiEnvelope<WebMultilanguageItem[]>>(url, {
    headers: {
      referer: context.referer,
    },
  });
}

export async function getApplicationParameters(options?: PublicApiOptions) {
  const context = resolveOptions(options);
  const url = buildApiUrl(
    `/api/generic/getApplicationParameters/${encodeURIComponent(
      context.domain
    )}/w`
  );

  return requestJson<ApiEnvelope<ApplicationParameterItem[]>>(url, {
    headers: {
      referer: context.referer,
    },
  });
}

export async function getTraderDefaults(options?: PublicApiOptions) {
  const context = resolveOptions(options);
  const url = buildApiUrl(
    `/api/generic/getTraderDefaults/${encodeURIComponent(context.domain)}/w`
  );

  return requestJson<ApiEnvelope<TraderDefaultsData>>(url, {
    headers: {
      referer: context.referer,
    },
  });
}

export async function getTraderPages(options?: PublicApiOptions) {
  const context = resolveOptions(options);
  const url = buildApiUrl(
    `/api/generic/getTraderPages/${encodeURIComponent(
      context.domain
    )}/${encodeURIComponent(context.device)}/${encodeURIComponent(
      context.languageId
    )}`
  );

  return requestJson<ApiEnvelope<TraderPageItem[]>>(url, {
    headers: {
      referer: context.referer,
    },
  });
}

// API V2 (/api-v2/...) - public sportsbook browsing endpoints.
export async function getTodaySportTypes(
  requestBody: ApiV2RequestBody = getDefaultApiV2Body(),
  options?: PublicApiOptions
) {
  const context = resolveOptions(options);
  const url = buildApiV2Url(
    `/api-v2/today-sport-types/${encodeURIComponent(
      context.device
    )}/${encodeURIComponent(context.languageId)}/${encodeURIComponent(
      context.traderId
    )}`
  );

  return requestJson<ApiEnvelope<TodaySportTypeItem[]>>(url, {
    headers: buildApiV2Headers(context, requestBody),
  });
}

export async function getBetTypeGroups(
  requestBody: ApiV2RequestBody = getDefaultApiV2Body(),
  options?: PublicApiOptions
) {
  const context = resolveOptions(options);
  const url = buildApiV2Url(
    `/api-v2/bet-type-groups/${encodeURIComponent(
      context.device
    )}/${encodeURIComponent(context.languageId)}/${encodeURIComponent(
      context.traderId
    )}`
  );

  return requestJson<ApiEnvelope<BetTypeGroupResponseItem[]>>(url, {
    headers: buildApiV2Headers(context, requestBody),
  });
}

export async function getLeftMenu(
  requestBody: ApiV2RequestBody = getDefaultApiV2Body(),
  options?: PublicApiOptions
) {
  const context = resolveOptions(options);
  const url = buildApiV2Url(
    `/api-v2/left-menu/${encodeURIComponent(
      context.device
    )}/${encodeURIComponent(context.languageId)}/${encodeURIComponent(
      context.traderId
    )}`
  );

  return requestJson<ApiEnvelope<FixtureTreeNode[]>>(url, {
    headers: buildApiV2Headers(context, requestBody),
  });
}

export async function getUpcomingEvents(
  requestBody: ApiV2RequestBody = getDefaultApiV2Body(),
  options?: PublicApiOptions
) {
  const context = resolveOptions(options);
  const url = buildApiV2Url(
    `/api-v2/upcoming-events/${encodeURIComponent(
      context.device
    )}/${encodeURIComponent(context.languageId)}/${encodeURIComponent(
      context.traderId
    )}`
  );

  return requestJson<ApiEnvelope<FixtureTreeNode[]>>(url, {
    headers: buildApiV2Headers(context, requestBody),
  });
}

export async function getPopularFixtures(
  requestBody: ApiV2RequestBody = getDefaultApiV2Body(),
  options?: PublicApiOptions
) {
  const context = resolveOptions(options);
  const url = buildApiV2Url(
    `/api-v2/popular-fixture/${encodeURIComponent(
      context.device
    )}/${encodeURIComponent(context.languageId)}/${encodeURIComponent(
      context.traderId
    )}`
  );

  return requestJson<ApiEnvelope<FixtureTreeNode[]>>(url, {
    headers: buildApiV2Headers(context, requestBody),
  });
}

export async function getPromotedEvents(
  requestBody: ApiV2RequestBody = getDefaultApiV2Body(),
  options?: PublicApiOptions
) {
  const context = resolveOptions(options);
  const url = buildApiV2Url(
    `/api-v2/promoted-events/${encodeURIComponent(
      context.device
    )}/${encodeURIComponent(context.languageId)}/${encodeURIComponent(
      context.traderId
    )}`
  );

  return requestJson<ApiEnvelope<FixtureTreeNode[]>>(url, {
    headers: buildApiV2Headers(context, requestBody),
  });
}

export function inferTraderContextFromPages(
  pages: TraderPageItem[] | undefined
): Pick<PublicApiOptions, 'traderId' | 'languageId'> {
  if (!pages || pages.length === 0) {
    return {};
  }

  const pageWithTraderInfo = pages.find(
    (page) =>
      typeof page.traderId === 'number' && typeof page.languageId === 'number'
  );

  if (!pageWithTraderInfo) {
    return {};
  }

  return {
    traderId: String(pageWithTraderInfo.traderId),
    languageId: String(pageWithTraderInfo.languageId),
  };
}
