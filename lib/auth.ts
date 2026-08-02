export type SessionUser = {
  id: string;
  name?: string | null;
  email?: string | null;
};

const ACCESS_TOKEN_KEY = "sektorel.accessToken";
const REFRESH_TOKEN_KEY = "sektorel.refreshToken";
const USER_KEY = "sektorel.user";

// Header hâlâ bu eski anahtarları okuyor. Faz 1 boyunca geriye uyumluluk
// sağlanıyor; AuthProvider geçişinden sonra kaldırılabilirler.
const LEGACY_ACCESS_TOKEN_KEY = "authToken";
const LEGACY_USER_KEY = "user";
const AUTH_CHANGED_EVENT = "sektorel:auth-changed";

function emitAuthChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

export function saveSession(authToken: string, refreshToken: string, user: SessionUser) {
  if (typeof window === "undefined") return;

  const normalizedUser: SessionUser = {
    ...user,
    name: user.name || user.email || "Üye",
  };

  // Access token localStorage'a da yazılır; böylece sayfa yenileme ve yeni
  // sekme sonrasında refresh akışı bağlanana kadar oturum kaybolmaz.
  sessionStorage.setItem(ACCESS_TOKEN_KEY, authToken);
  localStorage.setItem(ACCESS_TOKEN_KEY, authToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(normalizedUser));

  // Mevcut Header bileşeni için geçici uyumluluk.
  localStorage.setItem(LEGACY_ACCESS_TOKEN_KEY, authToken);
  localStorage.setItem(LEGACY_USER_KEY, JSON.stringify(normalizedUser));

  emitAuthChanged();
}

export function getAccessToken() {
  if (typeof window === "undefined") return null;

  const token =
    sessionStorage.getItem(ACCESS_TOKEN_KEY) ||
    localStorage.getItem(ACCESS_TOKEN_KEY) ||
    localStorage.getItem(LEGACY_ACCESS_TOKEN_KEY);

  if (token && !sessionStorage.getItem(ACCESS_TOKEN_KEY)) {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
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
    const user = JSON.parse(raw) as SessionUser;
    return {
      ...user,
      name: user.name || user.email || "Üye",
    };
  } catch {
    clearSession();
    return null;
  }
}

export function hasSession() {
  if (typeof window === "undefined") return false;

  // Header'ın mevcut çıkış butonu legacy anahtarları temizlediği için bu
  // anahtar aynı zamanda geçici oturum bayrağı olarak kullanılır.
  return Boolean(
    localStorage.getItem(LEGACY_ACCESS_TOKEN_KEY) &&
    getAccessToken() &&
    getRefreshToken() &&
    getSessionUser(),
  );
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
