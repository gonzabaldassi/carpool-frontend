export interface ReservationDTO{
    id:number;
    createdAt:string;
    startCity: string;
    destinationCity: string;
    baggage: boolean;
    nameUser: string;
    lastNameUser: string;
    urlImage: string;
}