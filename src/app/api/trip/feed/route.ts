
import { SearchTripResponse } from "@/modules/search/types/dto/searchTripResponseDTO";
import { NextRequest, NextResponse } from "next/server";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    const { searchParams } = new URL(req.url);
    const cityId = searchParams.get("cityId"); // puede ser null

    // Construimos la URL dinámica
    const url = cityId
      ? `${apiUrl}/trip/feed?cityId=${Number(cityId)}`
      : `${apiUrl}/trip/feed`; // ← sin cityId => backend usa ciudad por defecto

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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

    return NextResponse.json(response, { status: res.status });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      { data: null, messages: [message], state: "ERROR" },
      { status: 500 }
    );
  }
}
