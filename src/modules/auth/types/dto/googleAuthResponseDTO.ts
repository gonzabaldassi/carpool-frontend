import { BaseResponse } from "@/shared/types/response";

export interface GoogleAuthData {
  accessToken: string;
  refreshToken: string | null;
  email: string;
  name: string;
  status: string;
  needsAction: boolean;
};

export type GoogleLoginResponse = BaseResponse<GoogleAuthData>;
