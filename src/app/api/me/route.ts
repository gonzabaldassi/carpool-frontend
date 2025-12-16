import { NextRequest, NextResponse } from 'next/server';
import { parseJwt } from "@/shared/utils/jwt";

type Authority = { authority: string };

/**
 * Obtiene la información del usuario autenticado
 *
 * Extrae el token de las cookies y el username y roles del token JWT, realiza la llamada 
 * al backend para obtener los datos restantes del usuario autenticado, devuelve la respuesta
 * estándar de tipo UserDetailsResponse.
 * 
 * @param {NextRequest} req - Objeto de la petición entrante de Next.js
 * @returns {Promise<NextResponse>} - Respuesta JSON con el estado de la actualización
 */
export async function GET(request: NextRequest) {

  // Obtenemos el token JWT desde las cookies
  const token = request.cookies.get("token")?.value;

  // Si no existe el token, devolvemos un error 400
  if (!token) {
    return NextResponse.json({ 
      data: null, 
      messages: ["Token inválido o expirado"], 
      state: "ERROR" 
    }, { status: 400 });
  }

  try {

    // Decodificamos el token para obtener roles y username
    const decoded = parseJwt(token);

    if (!decoded || !decoded.authorities) {
      return NextResponse.json({ 
        data: null, 
        messages: ["Token inválido o sin roles"], 
        state: "ERROR" 
      }, { status: 401 });
    }

    // Parseamos las autoridades del token
    const rawAuthorities: Authority[] = typeof decoded.authorities === 'string'
      ? JSON.parse(decoded.authorities)
      : decoded.authorities;

    // Mapeamos las autoridades a roles reconocidos por la aplicación
    const roles = rawAuthorities
      .map((a) => {
        switch (a.authority) {
          case 'ROLE_USER':
            return 'user';
          case 'ROLE_DRIVER':
            return 'driver';
          default:
            return null;
        }
      })
      .filter(Boolean);

    // Armamos el objeto final del usuario combinando la info del backend y los roles del token
    const user = {
      username: decoded.username,
      roles
    };

    // Retornamos la respuesta con la estructura consistente { data, messages, state }
    return NextResponse.json({
      data: user,
      messages: ["Datos obtenidos correctamente"],
      state: "OK"
    }, { status: 200 });

  } catch (error: unknown) {
    // Manejo de errores inesperados
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      { data: null, messages: [message], state: "ERROR" }, 
      { status: 500 }
    );
  }
}
