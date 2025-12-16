


import { ChevronRight, Info, Star, UserRound } from "lucide-react";
import Image from "next/image";

import RouteLine from "./RouteLine";
import { SearchData } from "@/modules/search/types/search";
import { City } from "@/models/city";
import { capitalizeWords, formatTime, formatTimeRounded } from "@/shared/utils/string";
import { formatPrice } from "@/shared/utils/number";
import Separator from "@/components/ux/Separator";


interface TripCardProps {
  trip: SearchData;
  currentCity?: string
  originSearch?: City | null;
  destinationSearch?: City | null;
}

export default function Trip({ trip, currentCity, originSearch, destinationSearch }: TripCardProps) {

  //Origen del viaje
  const originStop = trip.tripStops.find(stop => stop.start === true && stop.destination === false);
  
  //Destino del viaje
  const destinationStop = trip.tripStops.find(stop => stop.destination === true && stop.start === false);

  // Origen actual segun si es por ubicacion actual o origen buscado
  const actualCity = originSearch?.name ?? currentCity
  // Destino actual, si es buscado se toma ese valor y si no se toma el destino original del viaje 
  const actualDestination = destinationSearch?.name ?? destinationStop?.cityName

  // Datos de ciudad como origen buscado
  const originSearchStop = trip.tripStops.find(stop => stop.cityName.toLowerCase() === actualCity?.toLowerCase());
  
  // Datos de ciudad como destino buscada
  const destinationSearchStop = trip.tripStops.find(stop => stop.cityName.toLowerCase() === actualDestination?.toLowerCase());

  // Se compureba si el origen actual es igual al origen del viaje
  const isActualOrigin =
    originStop?.cityName.toLowerCase() === actualCity?.toLowerCase() ;

  // Se compureba si el destino actual es igual al destino del viaje
  const isActualDestination =
    actualDestination?.toLowerCase() === destinationStop?.cityName.toLowerCase(); 

  // Comprueba si el origen o destino es una parada intermedia
  const isIntermediate = originSearchStop?.start === false || destinationSearchStop?.destination===false;
  
  // Comprueba si el origen actual es el origen original del viaje
  const isRealOrigin = originSearchStop?.start === true

  // Comprueba si el destino actual es el destino original del viaje
  const isRealDestination = destinationSearchStop?.destination===true;

  // Verifica que ambos sean paradas intermedias
  const isRealStop = originSearchStop?.start === false && destinationSearchStop?.destination===false;

  return (
    <div  className={`trip-card mb-4 p-4 border border-gray-2 rounded-lg shadow-sm transition-all duration-200 ${
        isIntermediate
          ? "bg-gray-2/20"
          : "border-gray-2"
      }`}>
      <div className="flex items-center ">
        <div className="flex flex-col w-full mb-2">
          <div className="flex items-start justify-between w-full">
            <div className="grid grid-cols-2 w-3/4">
              {/* Fila de horarios */}
              <div className="w-full">
                <div className="flex items-center">
                  <p>{formatTime(originSearchStop?.estimatedArrivalDateTime ?? '')}</p>
                  <RouteLine/>
                </div>
                
              </div>
              <div>
                <p>{formatTimeRounded(destinationSearchStop?.estimatedArrivalDateTime ?? '')}</p>
              </div>

              {/* Fila de ciudades */}
              {isActualOrigin ? 
                <div>
                  <p className="text-sm">{capitalizeWords(originStop?.cityName ?? '')}</p>
                  <p className="text-xs text-gray-11">{capitalizeWords(originStop?.observation ?? '')}</p>
                </div>
              : 
                <div>
                  <p className="text-sm">{capitalizeWords(originSearchStop?.cityName ?? '')}</p>
                  <p className="text-xs text-gray-11">{capitalizeWords(originSearchStop?.observation ?? '')}</p>
                </div>
              }
              
              {isActualDestination ?
                <div>
                  <p className="text-sm">{capitalizeWords(destinationStop?.cityName ?? '')}</p>
                  <p className="text-xs text-gray-11">{capitalizeWords(destinationStop?.observation ?? '')}</p>
                </div>
              : 
                <div>
                  <p className="text-sm">{capitalizeWords(destinationSearchStop?.cityName ?? '')}</p>
                  <p className="text-xs text-gray-11">{capitalizeWords(destinationSearchStop?.observation ?? '')}</p>
                </div>
              }
              
            </div>
           
            <div className="">
              {isActualOrigin ? 
                <p className="text-xl font-semibold">${formatPrice(trip.seatPrice)}</p>
              : 
                <p className="text-sm text-gray-11 md:text-lg lg:text-lg">$ a definir</p>
              }
              <p className="flex items-center gap-1 justify-end text-xl">
                {trip.availableSeat}
                <span><UserRound size={20}/></span>
              </p>
            </div>
          </div>
         
        </div>

      </div>
      {isIntermediate && 
        <div className="flex items-center gap-1 text-xs">
          <span>
            <Info size={14}/>
          </span> 
          {(isRealOrigin) &&
            <p>El viaje termina en <span className="font-semibold">{capitalizeWords(destinationStop?.cityName ?? '')}.</span></p> 
          }
          {(isRealDestination && !isRealOrigin) &&
            <p>El viaje inicia desde <span className="font-semibold">{capitalizeWords(originStop?.cityName ?? '')}.</span></p> 
          }
          {isRealStop &&
            <p>El viaje inicia desde <span className="font-semibold">{capitalizeWords(originStop?.cityName ?? '')}</span> y termina en <span className="font-semibold">{capitalizeWords(destinationStop?.cityName ?? '')}.</span></p> 
          }
        </div>}
      <Separator color="bg-gray-2" marginY="my-2"/>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Image
              src={trip.driverInfo.profileImageUrl}
              alt={trip.driverInfo.fullName}
              width={25}
              height={25}
              className="rounded-full object-cover border"
            />
            
            <p>{trip.driverInfo.fullName}</p>
          </div>
          
          <div className="border-l border-gray-2 px-4">
            <p
              className={`flex items-center gap-1 ${
                trip.driverInfo.rating >= 4
                  ? "text-success"
                  : trip.driverInfo.rating >= 3
                  ? "text-warning"
                  : "text-error"
              }`}
            >
              {trip.driverInfo.rating}
              <span>
                <Star size={12} fill="currentColor" />
              </span>
            </p>
          </div>
        </div>
       
        <ChevronRight size={20} strokeWidth={1}/>

      </div>
      
    </div>
  );
}
