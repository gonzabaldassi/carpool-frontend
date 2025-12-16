import { BaseResponse } from "@/shared/types/response";
import { City } from "@/models/city";


export type CitiesResponseDTO = BaseResponse<City[]>;