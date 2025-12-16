'use client'

import { MapPinOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import MyTrip from "./MyTrip";
import { TripDriverDTO } from "../types/tripDriver";

interface MyTripListProps{
    myTrips: TripDriverDTO[] | [];
}

const LOAD_SIZE = 5; 

export default function MyTripsList({myTrips}: MyTripListProps) {
    const router = useRouter();
    const [visibleCount, setVisibleCount] = useState(1);
    const loaderRef = useRef<HTMLDivElement | null>(null);

    const handleTripClick = (tripId: number) => {
        router.push(`/reservations/${tripId}`);
    }

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
            const target = entries[0];
            if (target.isIntersecting) {
                // Cargar 5 más cuando el sentinela sea visible
                setVisibleCount((prev) => Math.min(prev + LOAD_SIZE, myTrips.length));
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
    }, [myTrips.length]);

    if (myTrips.length === 0) {
        return (
            <div className="flex items-center justify-center p-4 gap-4 ">
                <div className="bg-dark-1 rounded-lg p-3">
                    <MapPinOff size={32} />
                </div>
                <div className="border border-gray-6 h-12"></div>
                <div>
                    <p className="text-lg font-medium leading-tight">No tienes viajes programados.</p>
                </div>
            </div>
        );
    }

    const visibleTrips = myTrips.slice(0, visibleCount);

    return (
        <div>
            {visibleTrips.map((trip, index) => {
        
                return (
                    <div key={index}>

                    <div 
                        onClick={() => handleTripClick(trip.id)} 
                        className="cursor-pointer block" // Añadir cursor-pointer para mejor UX
                    >
                        <MyTrip 
                            trip={trip} 
                        /> 
                    </div>
                        {/* Preguntar si hace falt aun endpoint para la ciudad por defecto*/}
                    </div>
                );
                })}
        
                {/* Loader o indicador al final */}
                {visibleCount < myTrips.length && (
                <div ref={loaderRef} className="py-4 text-center text-sm text-muted-foreground">
                    Cargando más viajes...
                </div>
            )}
        </div>
    )

    




}