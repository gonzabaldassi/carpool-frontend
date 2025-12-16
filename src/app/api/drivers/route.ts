import { fetchWithRefresh } from "@/shared/lib/http/authInterceptor";
import { DriverResponse } from "@/modules/driver/types/dto/driverResponseDTO";

import { NextRequest, NextResponse } from "next/server";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

/**
 * Actualiza el perfil de un usuario.
 *
 * Recibe los datos del perfil desde la petición, realiza la llamada 
 * al backend para registrar al usuario como conductor, devuelve la respuesta
 * estándar de tipo `DriverResponse` y actualiza el access y el refresh token.
 * 
 * @param {NextRequest} req - Objeto de la petición entrante de Next.js
 * @returns {Promise<NextResponse>} - Respuesta JSON con el estado del registro
 */
export async function POST(req: NextRequest) {
  try {
    // Recibir el token de la petición
    const token = req.cookies.get('token')?.value;
    const body = await req.json();

    // Llamada al backend con interceptor para refresco de tokens
    const res = await fetchWithRefresh(`${apiUrl}/drivers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" ,
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body),
    });

    const response: DriverResponse = await res.json();

    const newAccessToken = response.data?.accessToken;
    const newRefreshToken = response.data?.refreshToken;

    // Guardar nuevos tokens en cookies
    const nextRes = NextResponse.json(response, { status: res.status });

    if (newAccessToken) {
      nextRes.cookies.set("token", newAccessToken, {
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
    }

    if (newRefreshToken) {
      nextRes.cookies.set("refreshToken", newRefreshToken, {
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
    }

    // Devolver respuesta estandarizada
    return nextRes;
  } catch (error: unknown) {
    let message = "Error desconocido";
    if (error instanceof Error) message = error.message;

    return NextResponse.json({
      data: null,
      messages: [message],
      state: "ERROR",
    }, { status: 500 });
  }
}
