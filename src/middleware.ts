import { NextRequest, NextResponse } from "next/server";
import { PUBLIC_PATHS } from "./constants/publicPaths";
import {verifyTokenWithServer} from './services/auth/authService'
import { isTokenExpired, parseJwt } from "./shared/utils/jwt";


export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  //IGNORAR TODAS LAS API ROUTES DEL FRONTEND
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }


  //RUTAS PÚBLICAS
  const isPublicPage = PUBLIC_PATHS.pages.some((p) =>
    p === "/" ? pathname === "/" : pathname.startsWith(p)
  );

  if (isPublicPage) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/files')) return NextResponse.next();


  //TOKEN
  const token = req.cookies.get("token")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (!token) {
    return redirectToLogin(req);
  }


  //EXPIRACIÓN
  if (isTokenExpired(token)) {
    if (refreshToken) {
      const newTokens = await refreshAccessToken(refreshToken);
      if (newTokens) {
        const response = NextResponse.next();
        setTokenCookies(response, newTokens);
        return response;
      }
    }
    return redirectToLogin(req);
  }

  const isValid = await verifyTokenWithServer(token);
  if (!isValid) {
    return redirectToLogin(req);
  }

  //ROLES
  const payload = parseJwt(token);
  if (!payload) return redirectToLogin(req);

  return NextResponse.next();
}

//HELPERS

function redirectToLogin(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  return NextResponse.redirect(url);
}

async function refreshAccessToken(refreshToken: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${apiUrl}/auth/refresh`, {
      method: "POST",
      headers: { Authorization: `Bearer ${refreshToken}` },
    });

    if (!res.ok) return null;
    const data = await res.json();

    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken ?? refreshToken,
    };
  } catch {
    return null;
  }
}

function setTokenCookies(
  response: NextResponse,
  tokens: { accessToken: string; refreshToken?: string }
) {
  const { accessToken, refreshToken } = tokens;

  const decoded = JSON.parse(
    Buffer.from(accessToken.split(".")[1], "base64").toString()
  );
  const maxAge = decoded.exp - decoded.iat;

  response.cookies.set("token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge,
  });

  if (refreshToken) {
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
  }
}

//MATCHER
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icons|manifest.webmanifest).*)",
  ],
};
