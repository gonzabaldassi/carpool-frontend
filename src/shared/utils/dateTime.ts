export function formatDateTime(dateString: string | undefined): string {
  if (!dateString) return "";

  const date = new Date(dateString);
  const currentYear = new Date().getFullYear();
  const isSameYear = date.getFullYear() === currentYear;

  const formattedDate = date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    ...(isSameYear ? {} : { year: "numeric" }),
  });

  const formattedTime = date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${formattedDate}, ${formattedTime}`;
}

export function formatTime(dateString: string | undefined): string {
  if (!dateString) return "";

  const date = new Date(dateString);

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
});
}
