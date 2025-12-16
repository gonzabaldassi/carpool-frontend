import { ResetPasswordData } from "@/modules/password/schemas/resetPasswordSchema";
import { ProfileData } from "@/modules/profile/schemas/profileSchema";
import { UpdateEmailData } from "@/modules/settings/schemas/updateEmailSchema";
import { UpdatePasswordData } from "@/modules/settings/schemas/updatePasswordSchema";
import { TokensResponse, VoidResponse } from "@/shared/types/response";


/**
 * Actualiza el perfil de un usuario en el backend.
 *
 * Envía los datos del perfil al endpoint correspondiente y devuelve
 * la respuesta estándar `UserResponse`. En caso de error de red o
 * excepción, retorna un `UserResponse` con `data` en `null` y `state` como "ERROR".
 *
 * @param {ProfileData} data - Datos del perfil a actualizar.
 * @returns {Promise<UserResponse>} - Resultado de la actualización.
 */
export async function updateUser(data: ProfileData): Promise<TokensResponse> {
  try {
    const formData = new FormData();
    formData.append(
      "userProfileUpdateRequestDTO",
      new Blob([JSON.stringify({
        phone: data.phone,
        gender: data.gender?.toUpperCase(),
        removeProfileImage: data.removeProfileImage ?? false,
      })], { type: "application/json" })
    );

    if (data.file) formData.append("file", data.file);

    const res = await fetch('/api/users/update-profile', {
      method: 'PUT',
      body: formData,
      credentials: 'include',
    });

    const response: TokensResponse = await res.json();
    return response;
  } catch (error: unknown) {
    let message = "Error desconocido";
    if (error instanceof Error) message = error.message;
    return { data: null, messages: [message], state: "ERROR" };
  }
}


export async function updatePassword(data: UpdatePasswordData): Promise<TokensResponse> {
  try {
    const res = await fetch('/api/users/update-password',{
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include"
    })

    const response: TokensResponse = await res.json();

    return response;
  } catch (error: unknown) {
    let message = "Error desconocido";
    if (error instanceof Error) message = error.message;
    return { data: null, messages: [message], state: "ERROR" };
  }
}

export async function updateEmail(data: UpdateEmailData): Promise<TokensResponse> {
  try {
    const res = await fetch('/api/users/update-email',{
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include"
    })

    const response: TokensResponse = await res.json();

    return response;
  } catch (error: unknown) {
    let message = "Error desconocido";
    if (error instanceof Error) message = error.message;
    return { data: null, messages: [message], state: "ERROR" };
  }
}


export async function unlockAccount(data: ResetPasswordData): Promise<VoidResponse> {
  try {
    const res = await fetch('/api/users/unlock-account',{
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
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

export async function resetPassword(data: ResetPasswordData): Promise<VoidResponse> {
  try {
    const res = await fetch('/api/password-change',{
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
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