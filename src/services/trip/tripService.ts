import { Trip, TripFilters } from "@/models/trip";
import { TripDriverResponse } from "@/modules/driver-trips/types/dto/tripDriverResponseDTO";
import { SearchTripResponse } from "@/modules/search/types/dto/searchTripResponseDTO";
import { CurrentTripResponseDTO } from "@/modules/current-trip/types/dto/currentTripResponseDTO";
import { TripPriceCalculationResponseDTO, TripResponseDTO, VerifyCreatorResponse } from "@/modules/trip/types/dto/tripResponseDTO";
import { fetchWithRefresh } from "@/shared/lib/http/authInterceptor";
import { VoidResponse } from "@/shared/types/response";
import { TripHistoryUserResponse } from "@/modules/history/types/dto/TripHistoryUserResponseDTO";
import { TripPassengersResponseDTO } from "@/modules/trip-details/types/dto/tripPassengersResponseDTO";

export async function getTrips(filters: TripFilters, skip: number): Promise<SearchTripResponse> {
  try {
    const params = new URLSearchParams();
    params.append("skip", skip.toString());
    
    const res = await fetch(`/api/trip/search?${params.toString()}`,{
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

export async function getCurrentTrip(): Promise<CurrentTripResponseDTO> {
  try {
    const res = await fetch('/api/trip/current-trip',{
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })

    const response: CurrentTripResponseDTO = await res.json()

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

export async function getTripPassengers(tripId: number): Promise<TripPassengersResponseDTO> {
  try {
    const res = await fetch(`/api/trip/passengers?tripId=${tripId}`,{
      method: 'GET',
      credentials: 'include',
    })

    const response: TripPassengersResponseDTO = await res.json()

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

export async function getTripForUpdate(tripId: number): Promise<TripResponseDTO>{
  try{
    const res = await fetchWithRefresh(`/api/trip/my-trip/${tripId}`,{
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


export const validateTripDateTime = async(startDateTime: string,idOriginCty: number, idDestinationCity: number, idTrip?: number) =>{
  try {
    const formattedDateTime =  `${startDateTime}:00`
    
    const params = new URLSearchParams({
      startDateTime: formattedDateTime,
      idOriginCity: idOriginCty.toString(),
      idDestinationCity: idDestinationCity.toString(),
    })

    if (idTrip) {
      params.append("idTrip", idTrip.toString())
    }

    const res = await fetchWithRefresh(`/api/trip/check-trip-availability?${params}`, {
      credentials: "include"
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

export const getInitialFeed = async (skip:number,cityId?: number) => {
  const params = new URLSearchParams();

  params.append("skip", skip.toString());

  if (cityId) {
    params.append("cityId", cityId.toString());
  }

  const res = await fetchWithRefresh(`/api/trip/feed?${params.toString()}`);
  const response: SearchTripResponse = await res.json();

  if (!res.ok) {
    throw new Error(response.messages?.[0] || "Error desconocido");
  }

  return response;
  
};


export const getMyTrips = async (skip: number,states?: string[]) => {
  try {
    const params = new URLSearchParams();

    params.append('skip', skip.toString());

    if (states?.length) {
      params.append('states', states.join(','));
    }

    const query = `?${params.toString()}`;

    const res = await fetchWithRefresh(`/api/trip${query}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });
    
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

export const getHistoryTripUser = async ( skip:number,states?: string[]) => {
  try {
    const params = new URLSearchParams();

    if (skip !== undefined) {
      params.append("skip", skip.toString());
    }

    if (states?.length) {
      params.append("states", states.join(","));
    }

    const query = params.toString() ? `?${params.toString()}` : "";

    const res = await fetchWithRefresh(`/api/trip/history-trip-user${query}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });
    
    const response: TripHistoryUserResponse = await res.json();
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

export const calculatePriceTrip = async(seatPrice: number, availableCurrentSeats: number): Promise<TripPriceCalculationResponseDTO> =>{
  try {
    const res = await fetchWithRefresh(`/api/trip/calculate-price-trip?seatPrice=${seatPrice}&availableCurrentSeats=${availableCurrentSeats}`,{
      credentials: 'include'
    })

    const response: TripPriceCalculationResponseDTO = await res.json()

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

export const arriveTripStop = async (idTripStop:string) => {
  try {
    const res = await fetchWithRefresh('/api/trip/arrive-tripstop', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idTripStop }),
      credentials: 'include'
    })

    const response: VoidResponse = await res.json();
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

export const startTrip = async (idTrip:string) => {
  try {
    const res = await fetchWithRefresh('/api/trip/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idTrip }),
      credentials: 'include'
    })

    const response: VoidResponse = await res.json();
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

export const cancelTrip = async (idTrip:number, reason: string | undefined) => {
  try {
    const res = await fetchWithRefresh('/api/trip/cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idTrip, reason }),
      credentials: 'include'
    })

    const response: VoidResponse = await res.json();
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

export async function updateTrip(data: Trip): Promise<VoidResponse> {
  try {
    const res = await fetch('/api/trip',{
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data)
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
