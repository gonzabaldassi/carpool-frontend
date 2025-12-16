export function formatPrice(value: number | string): string {
  const numberValue = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(numberValue)) return "0";  
  // Formato con separador de miles y sin decimales
  return numberValue.toLocaleString("es-AR", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}