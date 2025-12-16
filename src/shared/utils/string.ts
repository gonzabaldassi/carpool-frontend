export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function capitalizeWords(str?: string) {
  if (!str) return ""; // devuelve string vacío si viene undefined
  return str
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString);

  return date.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, 
  });
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);

  // Devuelve en formato dd/mm/aaaa
  return date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

//saca tildes
export const normalizeText = (text: string) =>
  text
    .normalize("NFD") // separa las tildes de las letras
    .replace(/[\u0300-\u036f]/g, "") // elimina las tildes



export function formatTimeRounded(dateString: string): string {
  const date = new Date(dateString);

  // Redondear minutos al múltiplo de 5 más cercano
  const minutes = date.getMinutes();
  const roundedMinutes = Math.ceil(minutes / 5) * 5;

  date.setMinutes(roundedMinutes);
  date.setSeconds(0);
  date.setMilliseconds(0);

  return date.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

