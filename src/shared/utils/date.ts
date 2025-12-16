export function formatShortDate(date: Date) {
  return new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short' })
    .format(date)
    .replace('.', '') // quita el punto que a veces aparece en "feb."
    .replace(' ', '-'); // agrega guion entre día y mes
}

export function formatDateLong(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatFullDate(date: Date) {
  const formatted = new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  })
    .format(date)
    .replace(",", "");

  return formatted
    .split(" ")
    .map((word, index) => {
      if (index === 0 || index === formatted.split(" ").length - 1) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word;
    })
    .join(" ");
}

export function formatFullDateWithYear(date: Date) {
  const formatted = new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
    .format(date)
    .replace(",", "");

  return formatted
    .split(" ")
    .map((word, index) => {
      if (index === 0 || index === formatted.split(" ").length - 1) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word;
    })
    .join(" ");
}


/**
 * Convierte un string ISO (yyyy-mm-dd) en un Date ajustado a la zona horaria local
 * evitando desfases por UTC.
 */
export function parseLocalDate(isoDate: string): Date {
  const d = new Date(isoDate);
  d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
  return d;
}

/**
 * Devuelve un string ISO (yyyy-mm-dd) sin desfase horario, a partir de un Date.
 */
export function formatISODate(date: Date): string {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy.toISOString().slice(0, 10);
}

export function formatISOToShortDate(isoDate: string): string {
  const date = parseLocalDate(isoDate); // usa tu método existente para evitar desfase
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(date);
}
