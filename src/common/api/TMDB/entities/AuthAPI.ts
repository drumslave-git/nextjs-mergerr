import {BaseEntityAPI} from "@/common/api/BaseEntityAPI"

export interface AuthenticationResponse {
  success: boolean;
  status_code: number;
  status_message: string;
}

export class AuthAPI extends BaseEntityAPI {
  async authentication() {
    return await this._get<AuthenticationResponse, AuthenticationResponse>('authentication')
  }
}