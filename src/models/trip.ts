export interface Trip{
    startDateTime: string;
    idVehicle: number;
    tripstops?: TripStop[];
    availableSeat: number;
    availableBaggage?: string;
    seatPrice: number;
}

export interface TripStop{
    cityName: string;
    observation: string;
    start: boolean;
    destination: boolean;
    estimatedArrivalDateTime: string;
}

export interface TripFilters {
    originCityId: number;
    destinationCityId: number;
    userCityId?: number;
    departureDate?: string | null;
    minPrice?: number;
    maxPrice?: number;
    driverRating?: number;
    orderByDriverRating?: boolean;
}


