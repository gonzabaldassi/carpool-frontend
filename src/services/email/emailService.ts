import { VoidResponse } from "@/shared/types/response";


export async function sendChangePasswordEmail(email: string): Promise<VoidResponse> {
  try {
    const res = await fetch('/api/password-change/send-email',{
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({email}),
      credentials: "include"
    })

    const response: VoidResponse = await res.json();

    return response;
  } catch (error: unknown) {
    let message = "Error desconocido";
    if (error instanceof Error) message = error.message;
    return { data: null, messages: [message], state: "ERROR" };
  }
}