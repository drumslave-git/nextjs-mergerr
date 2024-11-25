import {AxiosInstance, AxiosResponse} from "axios"
import qs from "qs"

export class BaseEntityAPI {
  private _axios: AxiosInstance

  constructor(axios: AxiosInstance) {
    this._axios = axios
  }

  protected async _get<T>(uri: string, params: any = {}): Promise<AxiosResponse<T, any>> {
    return await this._axios.get<T>(`/${uri}?${qs.stringify(params)}`)
  }

  protected async _post<T>(uri: string, data: any = {}, params: any = {}): Promise<AxiosResponse<T, any>> {
    return await this._axios.post<T>(`/${uri}?${qs.stringify(params)}`, data)
  }

  protected async _put<T>(uri: string, data: any = {}, params: any = {}): Promise<AxiosResponse<T, any>> {
    return await this._axios.put<T>(`/${uri}?${qs.stringify(params)}`, data)
  }

  protected async _delete<T>(uri: string, params: any = {}): Promise<AxiosResponse<T, any>> {
    return await this._axios.delete<T>(`/${uri}?${qs.stringify(params)}`)
  }
}