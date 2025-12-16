import { useEffect, useState } from "react";
import { fetchCityById } from "@/services/city/cityService"; // tu método existente

export function useCityById(cityId?: number) {
  const [cityName, setCityName] = useState<string>("");

  useEffect(() => {
    if (!cityId) return;

    let isMounted = true; // para evitar setState en componente desmontado

    fetchCityById(cityId).then(res => {
      if (isMounted) setCityName(res.data?.name ?? '');
    });

    return () => {
      isMounted = false;
    };
  }, [cityId]);

  return cityName;
}
