import {BaseEntityAPI} from "@/common/api/BaseEntityAPI"

export class MovieAPI extends BaseEntityAPI {
  async details(id: number, language?: string) {
    return this._get<any, any>(`movie/${id}`, {language})
  }
}