'use client'
import { useEffect, useState } from "react";

import { getMyTrips } from "@/services/trip/tripService";

import MyTripsList from "./MyTripsList";
import { BiError } from "react-icons/bi";
import TripSkeleton from "@/modules/feed/components/TripSkeleton";
import { TripDriverResponseDTO } from "../types/dto/tripDriverResponseDTO";

export default function MyTrips() {
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState<string | null>(null)
    const [myTrips, setMyTrips] = useState<TripDriverResponseDTO | null>(null); 
    useEffect(() => {
        const fetchMyTrips = async () => {
            try{
                const responseMyTrips = await getMyTrips();
                if(responseMyTrips.state === "ERROR"){
                    setError(responseMyTrips.messages[0])
                }

                if(responseMyTrips.state === "OK" && responseMyTrips.data){
                    setMyTrips(responseMyTrips.data);
                }
                
            }catch(error){
                setError('Hubo un error inesperado al obtener los viajes.')
                console.error("Error cargando tus viajes:", error);
            }finally{
                setLoading(false);
            }
        };
        fetchMyTrips();
    },[]);
    

    if (loading) {
        return (
          <div className="w-full">
            {Array.from({ length: 2 }).map((_, i) => (
              <TripSkeleton key={i} />
            ))}
          </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center p-4 gap-4 ">
                <div className="bg-dark-1 rounded-lg p-3">
                    <BiError size={32} />
                </div>
                <div className="border border-gray-6 h-12"></div>
                <div>
                    <p className="text-lg font-medium leading-tight">{error}</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="w-full">
            <div className="mb-6">
                <h1 className="text-xl font-semibold">Adminstrá tus solicitudes de reserva</h1>
                <p className="font-inter">Seleccioná un viaje para ver sus solicitudes.</p>
            </div>
            <MyTripsList myTrips={myTrips?.trips ?? []}/>
        </div>
    );
}