
import { SearchTripResponse } from "@/modules/search/types/dto/searchTripResponseDTO";
import { NextRequest, NextResponse } from "next/server";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    const body = await req.json();

    if (!body) {
      return NextResponse.json(
        { data: null, messages:'Filtros inválidos', state: "ERROR" },
        { status: 400} 
      );
    }
   
    const res = await fetch(`${apiUrl}/trip/search`, {
        method:'POST',
        headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const response: SearchTripResponse = await res.json();

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

    return NextResponse.json(response,{ status: res.status });
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
