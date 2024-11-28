import {BaseEntityAPI} from "@/common/api/BaseEntityAPI"

export interface Genre {
  id: number;
  name: string;
}

export interface GenresResponse {
  genres: Genre[];
}

export class GenresAPI extends BaseEntityAPI {
  private async _list(type: string, language?: string) {
    return await this._get<GenresResponse, any>(`genre/${type}/list`, {language})
  }

  async movie(language?: string) {
    return await this._list('movie', language)
  }

  async tv(language?: string) {
    return await this._list('tv', language)
  }
}