
type JwtPayload = {
  sub: string;
  username: string;
  authorities: string | { authority: string }[]; // Puede venir como string (JSON) o como objeto ya parseado
  exp: number;
  iat: number;
};

export function parseJwt(token: string): JwtPayload | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const decoded = JSON.parse(jsonPayload);

    //Check si expiró
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  } catch (error: unknown) {
    let message = "Error desconocido";

    if (error instanceof Error) {
      message = error.message;
    }
    console.error('Error parsing token:', message);
    return true; // Si no se puede parsear, considerarlo expirado
  }
}

export function isValidJWT(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    const payload = JSON.parse(atob(parts[1]));
    const now = Math.floor(Date.now() / 1000);
    
    // Verificar que tenga expiración y no haya expirado
    return payload.exp && payload.exp > now;
  } catch {
    return false;
  }
}