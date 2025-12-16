
import { BaseResponse } from "@/shared/types/response";
import { ReservationDTO } from "../reservation";


export interface ReservationResponseDTO {
    reservation: ReservationDTO[];
}

export type ReservationResponse = BaseResponse<ReservationResponseDTO>;