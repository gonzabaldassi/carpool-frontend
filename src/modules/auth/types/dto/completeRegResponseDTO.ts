import { BaseResponse } from "@/shared/types/response";
import { RegisterData } from "../../schemas/registerSchema";


export interface CompleteRegData {
  data: unknown //poner la data que devuelve el back
}

export type CompleteRegResponse = BaseResponse<RegisterData>;