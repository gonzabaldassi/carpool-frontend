import { VoidResponse } from "@/shared/types/response";
import { NextRequest, NextResponse } from "next/server";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

/**
 * Valida que el chofer no tenga mas de un viaje creado con le misma fecha y hora.
 *
 * Recibe la fecha y hora del viaje realiza la llamada al backend
 * y devuelve la respuesta estándar indicando si es posible crearlo o no.
 *
 * @param {NextRequest} req - Objeto de la petición entrante de Next.js
 * @returns {Promise<NextResponse>} - Respuesta JSON con estado de la creación
 */
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    const { searchParams } = new URL(req.url);
    const datetime = searchParams.get('startDateTime');

    
    if (!datetime) {
        return NextResponse.json(
            { data: null, messages: ["Fecha y hora no proporcionada"], state: "ERROR" },
            { status: 400 }
        );
    }

    const res = await fetch(`${apiUrl}/trip/check-trip-availability?startDateTime=${datetime}`, {
      headers: { 
        'Authorization': `Bearer ${token}`
      },
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
