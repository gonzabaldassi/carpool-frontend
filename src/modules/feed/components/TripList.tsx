"use client";

import { MapPinOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Trip from "./Trip";
import { SearchData } from "@/modules/search/types/search";
import { City } from "@/models/city";
import { formatFullDate, formatFullDateWithYear, parseLocalDate } from "@/shared/utils/date";

interface TripListProps {
  feed: SearchData[] | [];
  currentCity?: string;
  originSearch?: City | null;
  destinationSearch?: City | null;
}

const SEARCH_CONTEXT_KEY = 'carpool_search_context';
const LOAD_SIZE = 5; // Tamaño de lote inicial y de carga

export default function TripList({ feed, currentCity, originSearch, destinationSearch }: TripListProps) {
  const router = useRouter();
  const [visibleCount, setVisibleCount] = useState(1);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const handleTripClick = (tripId: number) => {
    // 1. Crear el objeto de contexto con los IDs de la búsqueda
    const searchContext = {
      originId: originSearch?.id, 
      destinationId: destinationSearch?.id,
    };

    // 2. Guardar el contexto en sessionStorage
    sessionStorage.setItem(SEARCH_CONTEXT_KEY, JSON.stringify(searchContext));

    // 3. Navegar a la página de detalles
    router.push(`/trip/details/${tripId}`);
  };

  // --- Observer para detectar el scroll ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
          // Cargar 5 más cuando el sentinela sea visible
          setVisibleCount((prev) => Math.min(prev + LOAD_SIZE, feed.length));
        }
      },
      {
        rootMargin: "200px", // empieza a cargar un poco antes del final
        threshold: 0.1,
      }
    );

    const currentRef = loaderRef.current;

    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [feed.length]);

  const isThisYear = (date: Date) => {
    return date.getFullYear() === new Date().getFullYear();
  }

  if (feed.length === 0) {
    return (
      <div className="flex items-center justify-center p-4 gap-4 ">
        <div className="bg-dark-1 rounded-lg p-3">
          <MapPinOff size={32} />
        </div>
        <div className="border border-gray-6 h-12"></div>
        <div >
          <p className="text-lg font-medium leading-tight">No hay viajes disponibles</p>
          <p className="text-sm text-gray-9 font-inter" >
            Intenta ajustar tus filtros o volver más tarde.
          </p>
        </div>
      </div>
    );
  }

  // --- Lista visible según el contador ---
  const visibleTrips = feed.slice(0, visibleCount);
  let lastDate = "";
  return (
    <div className="">
      {visibleTrips.map((trip, index) => {
        const tripDate = parseLocalDate(trip.startDateTime.split("T")[0]);
        const tripDateString = tripDate.toISOString().slice(0, 10); // yyyy-mm-dd

        const showDateHeader = tripDateString !== lastDate;
        lastDate = tripDateString;

        return (
          <div key={index}>
            {showDateHeader && (
              <h1 className="font-semibold mb-2 text-lg">
                {
                  isThisYear(tripDate)
                  ? formatFullDate(tripDate)
                  : formatFullDateWithYear(tripDate)
                }
              </h1>
            )}
            <div 
                onClick={() => handleTripClick(trip.tripId)} 
                className="cursor-pointer block" // Añadir cursor-pointer para mejor UX
            >
              <Trip 
                trip={trip} 
                currentCity={currentCity ?? 'Villa Maria'} 
                originSearch={originSearch} 
                destinationSearch={destinationSearch}
              /> 
            </div>
             {/* Preguntar si hace falt aun endpoint para la ciudad por defecto*/}
          </div>
        );
      })}

      {/* Loader o indicador al final */}
      {visibleCount < feed.length && (
        <div ref={loaderRef} className="py-4 text-center text-sm text-muted-foreground">
          Cargando más viajes...
        </div>
      )}
    </div>
  );
}
