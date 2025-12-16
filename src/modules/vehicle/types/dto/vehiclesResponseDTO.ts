import { Vehicle } from "@/models/vehicle";
import { BaseResponse } from "@/shared/types/response";

export type VehiclesResponseDTO = BaseResponse<Vehicle[]>