import { Trip, TripFilters } from "@/models/trip";
import { TripDriverResponse } from "@/modules/driver-trips/types/dto/tripDriverResponseDTO";
import { SearchTripResponse } from "@/modules/search/types/dto/searchTripResponseDTO";
import { TripResponseDTO, VerifyCreatorResponse } from "@/modules/trip/types/dto/tripResponseDTO";
import { fetchWithRefresh } from "@/shared/lib/http/authInterceptor";
import { VoidResponse } from "@/shared/types/response";



export async function getTrips(filters: TripFilters): Promise<SearchTripResponse> {
  try {
    const res = await fetch('/api/trip/search',{
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(filters)
    })

    const response: SearchTripResponse = await res.json()

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

export async function newTrip(data: Trip): Promise<VoidResponse> {
  try {
    const res = await fetchWithRefresh('/api/trip',{
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

export async function getTripDetails(tripId: number): Promise<TripResponseDTO>{
  try{
    const res = await fetchWithRefresh(`/api/trip/${tripId}`,{
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    })

   const response: TripResponseDTO = await res.json()

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


export const validateTripDateTime = async(startDateTime: string) =>{
  try {
    const formattedDateTime =  `${startDateTime}:00`
    
    const res = await fetchWithRefresh(`/api/trip/check-trip-availability?startDateTime=${formattedDateTime}`,{
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

export async function verifyIfUserIsCreator(tripId: number): Promise<VerifyCreatorResponse>{
  try{
    const res = await fetch(`/api/trip/verify-creator/${tripId}`,{
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    })
   const response: VerifyCreatorResponse = await res.json()
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

export const getInitialFeed = async (cityId?: number) => {
  try {
    const url = cityId
      ? `/api/trip/feed?cityId=${cityId}`
      : `/api/trip/feed`;

    const res = await fetchWithRefresh(url);
    const response: SearchTripResponse = await res.json();

    if (!res.ok) {
      throw new Error(response.messages?.[0] || "Error desconocido");
    }

    return response;
  } catch (error: unknown) {
    let message = "Error desconocido";
    if (error instanceof Error) message = error.message;

    return { data: null, messages: [message], state: "ERROR" };
  }
};


export const getMyTrips = async () => {
  try {
    const res = await fetchWithRefresh('/api/trip', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    })
    const response: TripDriverResponse = await res.json();
    if (!res.ok) {
      throw new Error(response.messages?.[0] || 'Error desconocido');
    }
    
    return response;
  }catch (error: unknown) {
    let message = "Error desconocido";
    if (error instanceof Error) message = error.message;
    return { data: null, messages: [message], state: "ERROR" };
  } 
}
