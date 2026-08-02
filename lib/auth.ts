import { GRAPHQL_ENDPOINT } from "@/lib/error-handler";

export type SessionUser = {
  id: string;
  name?: string | null;
  email?: string | null;
};

type TokenPayload = {
  exp?: number;
};

type RefreshMutationResponse = {
  data?: {
    refreshSektorelToken?: {
      authToken?: string | null;
      refreshToken?: string | null;
    } | null;
  };
  errors?: Array<{ message?: string }>;
};

const ACCESS_TOKEN_KEY = "sektorel.accessToken";
const REFRESH_TOKEN_KEY = "sektorel.refreshToken";
const USER_KEY = "sektorel.user";

// Header merkezi AuthProvider'a taşınana kadar bu iki anahtar aktif oturum
// bayrağı ve geriye uyumluluk katmanı olarak tutuluyor.
const LEGACY_ACCESS_TOKEN_KEY = "authToken";
const LEGACY_USER_KEY = "user";
const AUTH_CHANGED_EVENT = "sektorel:auth-changed";
const TOKEN_REFRESH_LEEWAY_SECONDS = 30;

let refreshPromise: Promise<string | null> | null = null;

function emitAuthChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

function normalizeUser(user: SessionUser): SessionUser {
  return {
    ...user,
    name: user.name || user.email || "Üye",
  };
}

function decodeTokenPayload(token: string): TokenPayload | null {
  try {
    const encodedPayload = token.split(".")[1];
    if (!encodedPayload) return null;

    const normalized = encodedPayload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    return JSON.parse(atob(padded)) as TokenPayload;
  } catch {
    return null;
  }
}

export function isAccessTokenValid(
  token: string | null,
  leewaySeconds = TOKEN_REFRESH_LEEWAY_SECONDS,
) {
  if (!token) return false;

  const payload = decodeTokenPayload(token);
  if (!payload?.exp) return false;

  return payload.exp > Math.floor(Date.now() / 1000) + leewaySeconds;
}

function storeAccessToken(token: string) {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, token);

  // Eski sürümden kalmış kalıcı canonical access token'ı temizle.
  localStorage.removeItem(ACCESS_TOKEN_KEY);

  // Header henüz bu anahtarı okuduğu için geçici olarak güncel tutulur.
  localStorage.setItem(LEGACY_ACCESS_TOKEN_KEY, token);
}

export function saveSession(authToken: string, refreshToken: string, user: SessionUser) {
  if (typeof window === "undefined") return;

  const normalizedUser = normalizeUser(user);

  storeAccessToken(authToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(normalizedUser));
  localStorage.setItem(LEGACY_USER_KEY, JSON.stringify(normalizedUser));

  emitAuthChanged();
}

export function updateSessionTokens(authToken: string, refreshToken: string) {
  if (typeof window === "undefined") return;

  storeAccessToken(authToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  emitAuthChanged();
}

export function getAccessToken() {
  if (typeof window === "undefined") return null;

  const legacyToken = localStorage.getItem(LEGACY_ACCESS_TOKEN_KEY);
  if (!legacyToken) return null;

  const token =
    sessionStorage.getItem(ACCESS_TOKEN_KEY) ||
    localStorage.getItem(ACCESS_TOKEN_KEY) ||
    legacyToken;

  if (token && !sessionStorage.getItem(ACCESS_TOKEN_KEY)) {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }

  return token;
}

export function getRefreshToken() {
  return typeof window === "undefined" ? null : localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getSessionUser(): SessionUser | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(USER_KEY) || localStorage.getItem(LEGACY_USER_KEY);
  if (!raw) return null;

  try {
    return normalizeUser(JSON.parse(raw) as SessionUser);
  } catch {
    clearSession();
    return null;
  }
}

export function hasSession() {
  if (typeof window === "undefined") return false;

  return Boolean(
    localStorage.getItem(LEGACY_ACCESS_TOKEN_KEY) &&
    getRefreshToken() &&
    getSessionUser(),
  );
}

async function requestTokenRefresh(refreshToken: string) {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      Accept: "application/graphql-response+json, application/json;q=0.9",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      operationName: "RefreshSektorelToken",
      variables: { refreshToken },
      query: `
        mutation RefreshSektorelToken($refreshToken: String!) {
          refreshSektorelToken(
            input: {
              clientMutationId: "refresh-session"
              refreshToken: $refreshToken
            }
          ) {
            authToken
            refreshToken
          }
        }
      `,
    }),
  });

  if (!response.ok) {
    throw new Error(`Token yenileme isteği başarısız: ${response.status}`);
  }

  const payload = (await response.json()) as RefreshMutationResponse;
  const tokens = payload.data?.refreshSektorelToken;

  if (!tokens?.authToken || !tokens.refreshToken) {
    throw new Error(payload.errors?.[0]?.message || "Oturum yenilenemedi.");
  }

  return {
    authToken: tokens.authToken,
    refreshToken: tokens.refreshToken,
  };
}

export async function refreshAccessToken() {
  if (typeof window === "undefined" || !hasSession()) return null;

  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      clearSession();
      return null;
    }

    try {
      const tokens = await requestTokenRefresh(refreshToken);
      updateSessionTokens(tokens.authToken, tokens.refreshToken);
      return tokens.authToken;
    } catch (error) {
      console.warn("Oturum yenilenemedi.", error);
      clearSession();
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export async function getValidAccessToken() {
  if (typeof window === "undefined" || !hasSession()) return null;

  const token = getAccessToken();
  if (isAccessTokenValid(token)) return token;

  return refreshAccessToken();
}

export async function ensureSession() {
  const token = await getValidAccessToken();
  return Boolean(token && getSessionUser());
}

export function clearSession() {
  if (typeof window === "undefined") return;

  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(LEGACY_ACCESS_TOKEN_KEY);
  localStorage.removeItem(LEGACY_USER_KEY);

  emitAuthChanged();
}

export function subscribeToAuthChanges(listener: () => void) {
  if (typeof window === "undefined") return () => undefined;

  window.addEventListener(AUTH_CHANGED_EVENT, listener);
  window.addEventListener("storage", listener);

  return () => {
    window.removeEventListener(AUTH_CHANGED_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}
