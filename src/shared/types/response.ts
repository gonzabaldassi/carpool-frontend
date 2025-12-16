import { TokensData } from "@/modules/auth/types/tokens";

export interface BaseResponse<T>{
  data: T | null;
  messages: string[];
  state: string;
}

export type VoidResponse = BaseResponse<null>;
export type MediaResponse = BaseResponse<string>
export type TokensResponse = BaseResponse<TokensData>;