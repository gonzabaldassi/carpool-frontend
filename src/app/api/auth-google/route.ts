
import { NextRequest, NextResponse } from "next/server";
import { parseJwt } from "@/shared/utils/jwt";
import { GoogleLoginResponse } from "@/modules/auth/types/dto/googleAuthResponseDTO";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

/**
 * Inicia sesión mediante Google.
 *
 * Recibe el token del cliente, realiza la llamada 
 * al backend para iniciar sesión o registrarse con google, devuelve la respuesta
 * estándar de tipo GoogleLoginResponse y agrega/actualiza el access y el refresh token a la cookies.
 * 
 * @param {NextRequest} req - Objeto de la petición entrante de Next.js
 * @returns {Promise<NextResponse>} - Respuesta JSON con el estado de la actualización
 */
export async function POST(req: NextRequest) {
  try {
    // Extraer el client id token de la cookie
    const { idToken } = await req.json();

    if (!idToken) {
      return NextResponse.json({ 
        data: null, 
        messages: ["Client token no encontrado"], 
        state: "ERROR" 
      }, { status: 400 });
    }

    // Llamar al backend
    const res = await fetch(`${apiUrl}/auth-google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });

    if (!res.ok) {
      const errorJson: GoogleLoginResponse = await res.json();

      const errorRes = NextResponse.json(errorJson, { status: res.status });
      errorRes.cookies.delete("token");
      errorRes.cookies.delete("refreshToken");

      return errorRes;
    }

    const response: GoogleLoginResponse = await res.json();

    if (!response.data?.accessToken || !response.data?.refreshToken) {
      return NextResponse.json({ 
        data: null, 
        messages: ["Tokens inválidos"], 
        state: "ERROR" 
      }, { status: 401 });
    }

    const accessToken = response.data?.accessToken;
    const refreshToken = response.data?.refreshToken;

    const nextRes = NextResponse.json(response, { status: res.status });

    // Guardar ambos tokens en la cookie
    if (accessToken) {
      // Decodificar el token para calcular la duración
      const decoded = parseJwt(accessToken);
      const iat = Number(decoded?.iat);
      const exp = Number(decoded?.exp);
      const maxAge = exp > iat ? exp - iat : 60 * 60 * 2; // 2 horas por defecto

      nextRes.cookies.set('token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge, // Setear la duración
      })
    }

    if (refreshToken) {
      nextRes.cookies.set('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 días
      });
    }
    // Devolver respuesta estandarizada
    return nextRes;
  } catch (error: unknown) {
    // Manejo de errores inesperados
    const message = error instanceof Error ? error.message : "Error desconocido";
    const errorRes = NextResponse.json(
      { data: null, messages: [message], state: "ERROR" },
      { status: 500 }
    );
    errorRes.cookies.delete('token');
    errorRes.cookies.delete('refreshToken');
    return errorRes;
  }
}
