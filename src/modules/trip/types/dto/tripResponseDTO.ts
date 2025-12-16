import { BaseResponse } from "@/shared/types/response";
import { TripDetailsData } from "../tripDetails";

export type TripResponseDTO = BaseResponse<TripDetailsData>
export type VerifyCreatorResponse = BaseResponse<{ isCreator: boolean }>