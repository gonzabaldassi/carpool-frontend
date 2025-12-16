'use client'

import { getReservations } from "@/services/reservation/reservationService";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import TripReservationList from "./TripReservationList";
import { BiError } from "react-icons/bi";
import TripSkeleton from "@/modules/feed/components/TripSkeleton";
import { ReservationResponseDTO } from "../../create/types/dto/reservationResponseDTO";


export default function TripReservations() {
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null);
  const [tripReservations, setTripReservations] = useState<ReservationResponseDTO | null>(null); 
  const { id } = useParams();

  useEffect(() => {
    const fetchTripReservations = async () => {
      try{
        if(!id) return
        setLoading(true);
        const responseTripReservations = await getReservations({
          idTrip: Number(id),
          nameState: 'PENDING'
        })

        if(responseTripReservations.state == "ERROR"){
          setError(responseTripReservations.messages[0]);
        }

        if(responseTripReservations.state == "OK" && responseTripReservations.data){
          setTripReservations(responseTripReservations.data);
        }
      }catch(error){
        console.error("Error cargando las reservaciones del viaje:", error);
      }finally{
        setLoading(false);
      }
    }
    fetchTripReservations()
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
  
  return( 
    <div className="w-full">
      <TripReservationList tripReservations={tripReservations?.reservation ?? []}/>
    </div>
  )
}