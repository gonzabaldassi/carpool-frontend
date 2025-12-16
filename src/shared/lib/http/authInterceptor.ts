// TokenManager.ts
class TokenManager {
  private static instance: TokenManager;
  private isRefreshing = false;
  private refreshPromise: Promise<string | null> | null = null; // Devuelve nuevo accessToken

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  async refreshToken(): Promise<string | null> {
    // Si ya hay un refresh en progreso, esperar a que termine
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = this.performRefresh();

    try {
      const token = await this.refreshPromise;
      return token;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  private async performRefresh(): Promise<string | null> {
    try {
      const refresh = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include', // lee refreshToken de cookie
      });

      if (!refresh.ok) {
        console.error('[TOKEN] Refresh falló:', refresh.status);
        return null;
      }

      const data = await refresh.json();
      // Suponemos que el backend devuelve { accessToken, refreshToken }
      return data.data?.accessToken;
    } catch (error) {
      console.error('[TOKEN] Error en refresh:', error);
      return null;
    }
  }
}

export async function fetchWithRefresh(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  const tokenManager = TokenManager.getInstance();

  // Primer intento
  let res = await fetch(input, { ...init, credentials: 'include' });

  if (res.status !== 401) {
    return res;
  }

  console.warn(`[fetchWithRefresh] Token expirado para ${input}. Intentando refrescar...`);

  // Intentar refresh
  const newAccessToken = await tokenManager.refreshToken();

  if (!newAccessToken) {
    console.error('[fetchWithRefresh] No se pudo refrescar el token');
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error('Token inválido o expirado');
  }

  // Reemplazar Authorization con el nuevo token
  const newHeaders = {
    ...(init?.headers || {}),
    'Authorization': `Bearer ${newAccessToken}`,
  };

  // Reintento con nuevo token
  res = await fetch(input, { ...init, headers: newHeaders, credentials: 'include' });
  return res;
}
