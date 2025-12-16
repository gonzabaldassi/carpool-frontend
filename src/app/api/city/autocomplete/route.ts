import { CitiesResponseDTO } from "@/modules/city/types/dto/CitiesResponseDTO";
import { NextRequest, NextResponse } from "next/server";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");


    const res = await fetch(`${apiUrl}/city/autocomplete?name=${name}`, {
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`
      },
    });

    const response: CitiesResponseDTO = await res.json();

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