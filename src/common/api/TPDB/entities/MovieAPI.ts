import {BaseEntityAPI} from "@/common/api/BaseEntityAPI"
import {Data, MoviesResponse, SearchRequest} from "@/common/api/TPDB/types"

export class MovieAPI extends BaseEntityAPI {
  async get(identifier: string | number | undefined, filters: SearchRequest = {}, iterationCallback: (data: Data[]) => void | Promise<void> = () => Promise.resolve()) {
    if (identifier) {
      return await this._get<MoviesResponse, any>(`movies/${identifier}`, filters)
    }
    let resp = await this._get<MoviesResponse, any>('movies', filters)
    const {data, meta} = resp.data
    if (!data) {
      iterationCallback(resp.data)
      return resp
    }
    await iterationCallback(data)
    let currentPage = meta.current_page
    do {
      resp = await this._get<MoviesResponse, any>('movies', {
        ...filters,
        page: ++currentPage
      })
      await iterationCallback(resp.data.data)
    } while (currentPage < meta.total_pages)

    return resp
  }
}