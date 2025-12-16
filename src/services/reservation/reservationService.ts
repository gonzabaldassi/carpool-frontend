import { Reservation } from "@/models/reservation";
import { ReservationResponse } from "@/modules/reservation/create/types/dto/reservationResponseDTO";
import { ReservationDTO } from "@/modules/reservation/update/types/reservation";
import { ReservationUpdateDTO } from "@/modules/reservation/update/types/reservationUpdate";
import { fetchWithRefresh } from "@/shared/lib/http/authInterceptor";
import { VoidResponse } from "@/shared/types/response";


export async function newReservation(data: Reservation): Promise<VoidResponse> {
  try {
    const res = await fetchWithRefresh('/api/reservation',{
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include'
    })

    const response: VoidResponse = await res.json()

    if (!res.ok) {
      throw new Error(response.messages?.[0] || 'Error desconocido');
    }

    return response;
  } catch (error: unknown) {
    let message = "Error desconocido";
    if (error instanceof Error) message = error.message;

    return { data: null, messages: [message], state: "ERROR" };
  }
}

export async function getReservations(data: ReservationDTO): Promise<ReservationResponse>{
  try{
    const params = new URLSearchParams();

    // Agrega solo los parámetros que tienen valor
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        params.append(key, String(value));
      }
    });

    const url = `/api/reservation/filter?${params.toString()}`;

    const res = await fetchWithRefresh(url, {
      credentials: 'include',
    });

    const response: ReservationResponse = await res.json();
    
    if (!res.ok) {
      throw new Error(response.messages?.[0] || 'Error desconocido');
    }

    return response;
  }catch(error: unknown){
    let message = "Error desconocido";
    if (error instanceof Error) message = error.message;
    return { data: null, messages: [message], state: "ERROR" };
  }
}

export async function updateReservation(reservationUpdateRequest: ReservationUpdateDTO): Promise<VoidResponse>{
  try{
    const res = await fetchWithRefresh('/api/reservation',{
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reservationUpdateRequest),
      credentials: 'include'
    });

    const response: VoidResponse = await res.json()

    if (!res.ok) {
      throw new Error(response.messages?.[0] || 'Error desconocido');
    }

    return response;
  }catch(error: unknown){
    let message = "Error desconocido";
    if (error instanceof Error) message = error.message;
    return { data: null, messages: [message], state: "ERROR" };
  }
}