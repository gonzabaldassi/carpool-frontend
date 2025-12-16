import Separator from "@/components/ux/Separator";
import { R2_PUBLIC_PREFIX } from "@/constants/imagesR2";
import RouteLine from "@/modules/feed/components/RouteLine";

import { ChevronRight, UserRound } from "lucide-react";
import Image from "next/image";
import { TripDriverDTO } from "../types/tripDriver";
import { formatTime } from "@/shared/utils/dateTime";
import { capitalizeWords } from "@/shared/utils/string";
import { formatPrice } from "@/shared/utils/number";
import { formatISOToShortDate } from "@/shared/utils/date";


export interface MyTripProps{
    trip: TripDriverDTO
}

export default function MyTrip({trip}: MyTripProps) {
    return (
        <div className="mb-4 p-4 border border-gray-2 rounded-lg transition-all duration-200">
            <div className="flex items-start justify-between w-full">
                <div className="grid grid-cols-2 w-3/4">
                    <div className="w-full">
                        <div className="flex items-center">
                            <p>{formatTime(trip.startDateTime)}</p>
                            <RouteLine/>
                        </div>
                    </div>
                    <div>
                        <p>{formatTime(trip.estimatedArrivalDateTime)}</p>
                    </div>
                    <div>
                        <p className="text-sm">{capitalizeWords(trip.startCity ?? '')}</p>
                    </div>
                    <div>
                        <p className="text-sm">{capitalizeWords(trip?.destinationCity ?? '')}</p>
                    </div>
                </div>

                <div className="ml-4">
                    <p className="text-lg font-semibold">${formatPrice(trip.seatPrice)}</p>
                    <p className="flex items-center justify-end text-lg gap-1">
                    {trip.currentAvailableSeats}
                    <span><UserRound size={20}/></span>
                    </p>
                </div>
            </div>


            <Separator color="bg-gray-2" marginY="my-4"/>

                  
            <div className="flex flex-col w-full">
                <div className="flex items-center gap-4">
                    <Image
                        src={`${R2_PUBLIC_PREFIX}/${(trip.vehicle.vehicleTypeName).toLowerCase()}.png`}
                        alt={`Imagen Tipo Vehiculo ${(trip.vehicle.vehicleTypeName).toLowerCase()}`}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                    />
                    <div className="w-full">
                        <div className="leading-none text-sm">
                            <div className="flex items-center gap-1">
                                <p className="font-semibold">{capitalizeWords(trip.vehicle.brand)} </p>
                                <p className="">{capitalizeWords(trip.vehicle.model)}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between w-full">
                            <p className="text-xs">{trip.vehicle.domain}</p>
                            <div className="flex items-center gap-2">
                                <p className="flex items-center gap-1 text-xs">
                                    {formatISOToShortDate(trip.startDateTime)}
                                </p>
                                <ChevronRight size={20} strokeWidth={1}/>
                            </div>      
                        </div>
                    </div>
                 </div>
            </div>
        </div>
    )
}