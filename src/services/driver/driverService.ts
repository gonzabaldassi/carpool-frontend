import { DriverData } from "@/modules/driver/schema/driverSchema";
import { DriverResponse } from "@/modules/driver/types/dto/driverResponseDTO";


/**
 * Registra un usuario como conductor (driver).
 * 
 * Envía los datos del conductor al endpoint correspondiente y devuelve 
 * la respuesta estándar `DriverResponse`. En caso de error de red o
 * excepción, retorna un `DriverResponse` con `data` en `null` y `state` como "ERROR".
 *
 * @param {DriverData} data - Datos del conductor
 * @returns {Promise<DriverResponse>} - Respuesta del backend
 */
export async function registerDriver( data: DriverData): Promise<DriverResponse> {
  try {
    const body = { ...data};

    const res = await fetch(`/api/drivers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'include', 
    });

    const response: DriverResponse = await res.json();

    if (!res.ok){
      throw new Error(response.messages?.[0])
    }

    return response;
  } catch (error: unknown) {
    let message = "Error desconocido";
    if (error instanceof Error) message = error.message;

    return { data: null, messages: [message], state: "ERROR" };
  }
}