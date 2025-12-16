import { TripDriverResponse } from "@/modules/driver-trips/types/dto/tripDriverResponseDTO";
import { VoidResponse } from "@/shared/types/response";
import { NextRequest, NextResponse } from "next/server";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

/**
 * Obtiene los viajes del chofer autenticado.
 *
 *
 * @param {NextRequest} req - Objeto de la petición entrante de Next.js
 * @returns {Promise<NextResponse>} - Respuesta JSON con estado de la creación
 */
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;

    const res = await fetch(`${apiUrl}/trip`, {
      headers: { 
        "Content-Type": "application/json" ,
        'Authorization': `Bearer ${token}`
      },
    });

    const response: TripDriverResponse = await res.json();

    if (!res.ok || response.state === "ERROR") {
      const messages =
        response.messages?.length > 0
          ? response.messages
          : ["Error desconocido"];
      return NextResponse.json(
        { data: null, messages, state: "ERROR" },
        { status: res.ok ? 200 : res.status } 
      );
    }

    return NextResponse.json(response, { status: res.status });
  } catch (error: unknown) {
    // Manejo de errores inesperados
    const message = error instanceof Error ? error.message : "Error desconocido";
    const errorRes = NextResponse.json(
      { data: null, messages: [message], state: "ERROR" },
      { status: 500 }
    );
    return errorRes;
  }
}
/**
 * Crea un nuevo viaje para el usuario autenticado.
 *
 * Recibe los datos del viaje, incluido el vehiculo asociado, realiza la llamada al backend
 * y devuelve la respuesta estándar indicando si se creó correctamente.
 *
 * @param {NextRequest} req - Objeto de la petición entrante de Next.js
 * @returns {Promise<NextResponse>} - Respuesta JSON con estado de la creación
 */
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    const body = await req.json();

    const res = await fetch(`${apiUrl}/trip`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" ,
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body),
    });

    const response: VoidResponse = await res.json();

    if (!res.ok || response.state === "ERROR") {
      const messages =
        response.messages?.length > 0
          ? response.messages
          : ["Error desconocido"];
      return NextResponse.json(
        { data: null, messages, state: "ERROR" },
        { status: res.ok ? 200 : res.status } 
      );
    }

    return NextResponse.json(response, { status: res.status });
  } catch (error: unknown) {
    // Manejo de errores inesperados
    const message = error instanceof Error ? error.message : "Error desconocido";
    const errorRes = NextResponse.json(
      { data: null, messages: [message], state: "ERROR" },
      { status: 500 }
    );
    return errorRes;
  }
}
