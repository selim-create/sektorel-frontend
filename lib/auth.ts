export type SessionUser = {
  id: string;
  name?: string | null;
  email?: string | null;
};

const ACCESS_TOKEN_KEY = "sektorel.accessToken";
const REFRESH_TOKEN_KEY = "sektorel.refreshToken";
const USER_KEY = "sektorel.user";

export function saveSession(authToken: string, refreshToken: string, user: SessionUser) {
  if ( typeof window === "undefined" ) return;

  sessionStorage.setItem(ACCESS_TOKEN_KEY, authToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getAccessToken() {
  return typeof window === "undefined" ? null : sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return typeof window === "undefined" ? null : localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getSessionUser(): SessionUser | null {
  if ( typeof window === "undefined" ) return null;

  const raw = localStorage.getItem(USER_KEY);
  if ( ! raw ) return null;

  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    clearSession();
    return null;
  }
}

export function hasSession() {
  return Boolean(getAccessToken() && getRefreshToken() && getSessionUser());
}

export function clearSession() {
  if ( typeof window === "undefined" ) return;

  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
