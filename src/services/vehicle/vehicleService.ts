
import { VehicleResponseDTO } from "@/modules/vehicle/types/dto/vehicleResponseDTO";
import { VehiclesResponseDTO } from "@/modules/vehicle/types/dto/vehiclesResponseDTO";
import { vehicleFormData } from "@/modules/vehicle/types/vehicle";
import { VoidResponse } from "@/shared/types/response";



export async function getVehicleById(id: number): Promise<VehicleResponseDTO> {
  try {
    const res = await fetch(`/api/vehicle?id=${id}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!res.ok) {
      const errorMessage = await res.json();
      throw new Error(errorMessage.message);
    }

    const response: VehicleResponseDTO = await res.json();

    return response;
  } catch (error: unknown) {
    let message = "Error desconocido";
    if (error instanceof Error) message = error.message;

    return { data: null, messages: [message], state: "ERROR" };
  }
}

export async function getVehicles(): Promise<VehiclesResponseDTO> {
  try {
    const res = await fetch("/api/vehicle", {
      method: "GET",
      credentials: "include", // incluye las cookies (donde está el token)
    });

    const response: VehiclesResponseDTO = await res.json();

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

export async function registerVehicle(data: vehicleFormData): Promise<VoidResponse> {
  try {
    const res = await fetch('/api/vehicle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    })

    const response: VoidResponse = await res.json();

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

export async function updateVehicle(id: number, data: vehicleFormData): Promise<VoidResponse> {
  try {
    const res = await fetch(`/api/vehicle?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });

    const response: VoidResponse = await res.json();

    if (!res.ok) {
      throw new Error(response.messages?.[0] || "Error desconocido");
    }

    return response;
  } catch (error: unknown) {
    let message = "Error desconocido";
    if (error instanceof Error) message = error.message;

    return { data: null, messages: [message], state: "ERROR" };
  }
}

export async function deleteVehicle(id: number): Promise<VoidResponse> {
  try {
    const res = await fetch(`/api/vehicle?id=${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    const response: VoidResponse = await res.json();

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