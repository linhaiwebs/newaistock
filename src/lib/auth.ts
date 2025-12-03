const TOKEN_KEY = 'adminToken';
const USER_KEY = 'adminUser';
const TOKEN_TIMESTAMP_KEY = 'adminTokenTimestamp';
const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(TOKEN_TIMESTAMP_KEY, Date.now().toString());
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_TIMESTAMP_KEY);
}

export function isTokenExpired(): boolean {
  const timestamp = localStorage.getItem(TOKEN_TIMESTAMP_KEY);
  if (!timestamp) return true;

  const tokenAge = Date.now() - parseInt(timestamp, 10);
  return tokenAge > TOKEN_EXPIRY_MS;
}

export function getTokenAge(): number {
  const timestamp = localStorage.getItem(TOKEN_TIMESTAMP_KEY);
  if (!timestamp) return TOKEN_EXPIRY_MS;

  return Date.now() - parseInt(timestamp, 10);
}

export function getTokenRemainingTime(): number {
  const age = getTokenAge();
  return Math.max(0, TOKEN_EXPIRY_MS - age);
}

export function requireValidToken(): string {
  const token = getToken();

  if (!token) {
    throw new Error('NO_TOKEN');
  }

  if (isTokenExpired()) {
    removeToken();
    throw new Error('TOKEN_EXPIRED');
  }

  return token;
}

export function setUser(user: any): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser(): any | null {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
}
