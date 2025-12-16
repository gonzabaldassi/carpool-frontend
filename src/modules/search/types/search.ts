export interface SearchData {
    driverInfo: {
        fullName: string
        profileImageUrl: string
        rating: number
    }
    startDateTime: string 
    tripStops: {
        cityName: string
        observation: string
        estimatedArrivalDateTime: string
        destination: boolean
        start: boolean
    }[]
    availableSeat: number
    seatPrice: number
    tripId:number
}