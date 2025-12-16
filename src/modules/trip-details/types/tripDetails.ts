import { TripStop } from "@/models/tripStop";
import { VehicleResponseTripDTO } from "@/modules/driver-trips/types/vehicleTrip";
import { DriverSearchResponseDTO } from "@/modules/trip/types/driverSearch";


export interface TripDetailsData {
    id: number;
    startDateTime: string;
    currentAvailableSeats: number;
    driverInfo: DriverSearchResponseDTO;
    vehicle: VehicleResponseTripDTO;
    tripStops: TripStop[]
    availableSeat: number;
    availableBaggage: string;
    seatPrice: number;
}