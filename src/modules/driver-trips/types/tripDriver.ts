import { VehicleResponseTripDTO } from "./vehicleTrip";


export interface TripDriverDTO {
    id:number;
    vehicle: VehicleResponseTripDTO;
    startDateTime: string;
    estimatedArrivalDateTime:string;
    availableSeats: number;
    currentAvailableSeats: number;
    startCity: string;
    destinationCity: string;
    availableBaggage: number;
    seatPrice: number;
}