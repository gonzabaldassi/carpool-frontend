
import { BaseResponse } from "@/shared/types/response";
import { TripDriverDTO } from "../tripDriver";


export interface TripDriverResponseDTO {
    trips: TripDriverDTO[];
}

export type TripDriverResponse = BaseResponse<TripDriverResponseDTO>;