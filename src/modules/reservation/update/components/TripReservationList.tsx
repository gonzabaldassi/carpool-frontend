'use client'

import { updateReservation } from "@/services/reservation/reservationService";

import { TicketX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AlertDialog } from "@/components/ux/AlertDialog";
import { ReservationDTO } from "../../create/types/reservation";
import Reservation from "../../create/components/Reservation";



interface TripReservationListProps{
  tripReservations: ReservationDTO[] | [];
}

const LOAD_SIZE = 5;

export default function TripReservationList({tripReservations}: TripReservationListProps) {
  const [visibleCount, setVisibleCount] = useState(1);
  const loaderRef = useRef<HTMLDivElement | null>(null);    
  const [loadingAcceptId, setLoadingAcceptId] = useState<number | null>(null);
    const [loadingRejectId, setLoadingRejectId] = useState<number | null>(null);

  const [alertData, setAlertData] = useState<{
      type: "success" | "error" | "info" | null;
      title?: string;
      description?: string;
      onConfirm?: () => void;
  } | null>(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
          (entries) => {
          const target = entries[0];
          if (target.isIntersecting) {
              // Cargar 5 más cuando el sentinela sea visible
              setVisibleCount((prev) => Math.min(prev + LOAD_SIZE, tripReservations.length));
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
    }, [tripReservations.length]);

  const handleAcceptReservation = async (idReservation: number) =>{
    setLoadingAcceptId(idReservation);
    try {
        const result = await updateReservation({ idReservation, reject: false });
        if (result?.state === 'OK') {
            setAlertData({
                type: "success",
                title: "¡Reserva aceptada con éxito!",
                description: "Se le notificará al pasajero.",
                onConfirm: () => window.location.reload(),
            });
        }else{
            setAlertData({
                type: "error",
                title: "Hubo un problema",
                description: result.messages[0],
                onConfirm: () => window.location.reload(),
            });
        }
    } catch (error) {
        setAlertData({
            type: "error",
            title: "Hubo un problema",
            description: "No se pudo aceptar la reserva.",
            onConfirm: () => window.location.reload(),
        });
        console.error("Error al aceptar la reserva", error);
    }finally{
        setLoadingAcceptId(null);
    }
  }

    const handleRejectReservation = async (idReservation: number) => {
        setLoadingRejectId(idReservation);
        try {
            const result = await updateReservation({idReservation, reject: true });
            if (result?.state === 'OK') {
              window.location.reload();
            }else{
                setAlertData({
                    type: "error",
                    title: "Hubo un problema",
                    description: result.messages[0],
                    onConfirm: () => window.location.reload(),
                });
            }
        } catch (error) {
            setAlertData({
                type: "error",
                title: "Hubo un problema",
                description: "No se pudo aceptar la reserva.",
                onConfirm: () => window.location.reload(),
            });
            console.error("Error al rechazar la reserva", error);
        }finally{
            setLoadingRejectId(null);
        }
    }

  const handleConfirm = (scope: 'ACCEPT'|'REJECT',idReservation: number)=>{
    if(scope==="ACCEPT"){
        setAlertData({
            type: "info",
            title: "Aceptar Reserva",
            description: "¿Estás seguro de que deseas aceptar esta reserva?",
            onConfirm: () => handleAcceptReservation(idReservation),
        });
    }
    if(scope === 'REJECT'){
        setAlertData({
            type: "info",
            title: "Rechazar Reserva",
            description: "¿Estás seguro de que deseas rechazar esta reserva?",
            onConfirm: () => handleRejectReservation(idReservation),
        });
    }
  }

  if (tripReservations.length === 0) {
    return (
        <div className="flex items-center justify-center p-4 gap-4 ">
            <div className="bg-dark-1 rounded-lg p-3">
                <TicketX size={32} />
            </div>
            <div className="border border-gray-6 h-12"></div>
            <div>
                <p className="text-lg font-medium leading-tight">Este viaje no tiene reservas.</p>
            </div>
        </div>
    );
  }

  const visibleReservations = tripReservations.slice(0, visibleCount);


  return (
      <div>
          {visibleReservations.map((reservation, index) => {
      
              return (
                  <div key={index}>

                  <div 
                      // onClick={() => handleTripClick(trip.id)} 
                      className="cursor-pointer block" // Añadir cursor-pointer para mejor UX
                  >
                      <Reservation 
                        reservation={reservation}
                        onAccept = {() => handleConfirm('ACCEPT',reservation.id)}
                        onReject={()=>handleConfirm("REJECT", reservation.id)} 
                        isAccepting={loadingAcceptId === reservation.id}
                        isRejecting={loadingRejectId === reservation.id}
                      /> 
                  </div>
                      {/* Preguntar si hace falt aun endpoint para la ciudad por defecto*/}
                  </div>
              );
              })}
      
              {/* Loader o indicador al final */}
              {visibleCount < tripReservations.length && (
              <div ref={loaderRef} className="py-4 text-center text-sm text-muted-foreground">
                  Cargando más reservas...
              </div>
          )}

            {alertData && (
                <AlertDialog
                    isOpen={!!alertData}
                    onClose={() => setAlertData(null)}
                    type={alertData.type ?? 'info'}
                    title={alertData.title}
                    description={alertData.description}
                    confirmText="Aceptar"
                    onConfirm={alertData.onConfirm}
                />
            )}
      </div>
  )
}