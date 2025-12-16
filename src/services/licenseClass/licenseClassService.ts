import { LicenseClassResponseDTO } from "@/modules/driver/types/dto/licenseClassResponseDTO";

export async function fetchLicenseClasses(): Promise<LicenseClassResponseDTO> {
  const res = await fetch(`/api/license-class`,{
    headers: {
        "Content-Type": "application/json",
    },
    credentials: 'include'
  });

  if (!res.ok) throw new Error("Error al obtener las clases de licencia");

  const response: LicenseClassResponseDTO = await res.json();
  return response; 
}