import { VoidResponse } from "@/shared/types/response";
import { NextRequest, NextResponse } from "next/server";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

/**
 * Completa el registro de un usuario.
 *
 * Recibe el email y datos adicionales del formulario de registro,
 * realiza la llamada al backend para completar el registro del usuario,
 * y devuelve la respuesta estandarizada de tipo CompleteRegResponse.
 * 
 * @param {NextRequest} req - Objeto de la petición entrante de Next.js que contiene el body con los datos del usuario.
 * @returns {Promise<NextResponse>} - Respuesta JSON con la información del registro completado o un error estandarizado.
 */
export async function POST(req: NextRequest) {
  try {
    // Recibir y desestructurar los datos del body
    const body = await req.json();
    const { email, ...rest } = body;

    // Validar si email tiene valor
    if (!email) {
      return NextResponse.json({ 
        data: null, 
        messages: ["Falta el campo 'email' en el body"], 
        state: "ERROR" 
      }, { status: 400 });
    }
    
    // Extraer token de autorización de la cookie
    const token = req.cookies.get('token')?.value;

    const res = await fetch(`${apiUrl}/users/complete-registration`, {
      method: "POST",
      headers: { "Content-Type": "application/json" ,
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ email, ...rest }),
    });

    const response: VoidResponse = await res.json();

    // Devolver respuesta estandarizada
    return NextResponse.json(response, { status: res.status });
  } catch (error: unknown) {
    // Manejo de errores
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      { data: null, messages: [message], state: "ERROR" }, 
      { status: 500 }
    );
  }
}
