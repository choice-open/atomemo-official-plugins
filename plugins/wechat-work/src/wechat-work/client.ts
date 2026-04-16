const QYAPI_BASE = "https://qyapi.weixin.qq.com/cgi-bin";

export type WechatWorkCredentialPayload = {
  client_id?: string;
  client_secret?: string;
  access_token?: string;
  refresh_token?: string;
  expires_at?: number;
};

export function resolveWechatWorkCredential(
  credentials: Record<string, unknown> | undefined,
  credentialId: string,
): WechatWorkCredentialPayload {
  if (!credentials?.[credentialId]) {
    throw new Error(
      "Invalid credential_id. Please select a valid WeChat Work (企业微信) credential.",
    );
  }
  return credentials[credentialId] as WechatWorkCredentialPayload;
}

type GetTokenResponse = {
  errcode?: number;
  errmsg?: string;
  access_token?: string;
  expires_in?: number;
};

export type AccessTokenBundle = {
  access_token: string;
  /** Unix timestamp (seconds) when the token should be treated as expired. */
  expires_at: number;
};

/**
 * Calls WeChat Work `gettoken` (corpid + corpsecret). Maps OAuth `client_id` → corpid, `client_secret` → corpsecret.
 */
export async function fetchAccessTokenWithSecret(
  clientId: string,
  clientSecret: string,
): Promise<AccessTokenBundle> {
  const url = new URL(`${QYAPI_BASE}/gettoken`);
  url.searchParams.set("corpid", clientId);
  url.searchParams.set("corpsecret", clientSecret);
  const res = await fetch(url);
  const data = (await res.json()) as GetTokenResponse;
  if (
    data.errcode !== 0 ||
    typeof data.access_token !== "string" ||
    !data.access_token
  ) {
    throw new Error(
      data.errmsg ??
        `WeChat Work gettoken failed (errcode=${String(data.errcode)})`,
    );
  }
  const expiresIn =
    typeof data.expires_in === "number" && Number.isFinite(data.expires_in)
      ? data.expires_in
      : 7200;
  const expires_at = Math.floor(Date.now() / 1000) + expiresIn;
  return { access_token: data.access_token, expires_at };
}

const TOKEN_SKEW_SEC = 120;

/** Prefer Hub-managed access_token + expires_at; otherwise fetch with client credentials. */
export async function getAccessTokenForCredential(
  raw: WechatWorkCredentialPayload,
): Promise<string> {
  const clientId =
    typeof raw.client_id === "string" ? raw.client_id.trim() : "";
  const clientSecret =
    typeof raw.client_secret === "string" ? raw.client_secret.trim() : "";
  if (!clientId || !clientSecret) {
    throw new Error(
      "Selected credential is missing client_id or client_secret.",
    );
  }

  const now = Math.floor(Date.now() / 1000);
  const expiresAt = typeof raw.expires_at === "number" ? raw.expires_at : 0;
  const stored =
    typeof raw.access_token === "string" ? raw.access_token.trim() : "";

  if (stored && expiresAt > now + TOKEN_SKEW_SEC) {
    return stored;
  }

  const { access_token } = await fetchAccessTokenWithSecret(
    clientId,
    clientSecret,
  );
  return access_token;
}

export function assertWechatWorkOk(data: {
  errcode?: number;
  errmsg?: string;
}): void {
  if (data.errcode !== undefined && data.errcode !== 0) {
    throw new Error(
      data.errmsg ?? `WeChat Work API error (errcode=${String(data.errcode)})`,
    );
  }
}

export async function wechatWorkGetJson<
  T extends { errcode?: number; errmsg?: string },
>(
  path: string,
  accessToken: string,
  extraParams?: Record<string, string>,
): Promise<T> {
  const url = new URL(
    `${QYAPI_BASE}${path.startsWith("/") ? path : `/${path}`}`,
  );
  url.searchParams.set("access_token", accessToken);
  if (extraParams) {
    for (const [k, v] of Object.entries(extraParams)) {
      if (v !== "") url.searchParams.set(k, v);
    }
  }
  const res = await fetch(url);
  const data = (await res.json()) as T;
  assertWechatWorkOk(data);
  return data;
}

export async function wechatWorkPostJson<
  T extends { errcode?: number; errmsg?: string },
>(
  path: string,
  accessToken: string,
  body: Record<string, unknown>,
): Promise<T> {
  const url = new URL(
    `${QYAPI_BASE}${path.startsWith("/") ? path : `/${path}`}`,
  );
  url.searchParams.set("access_token", accessToken);
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as T;
  assertWechatWorkOk(data);
  return data;
}
