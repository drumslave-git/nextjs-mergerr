import {TMDBApi} from "@/common/api/TMDB/api"
import {SearchResponse} from "@/common/api/TMDB/entities/SearchAPI"
import {TPDBApi} from "@/common/api/TPDB/api"
import {Data} from "@/common/api/TPDB/types"
import axios, {AxiosInstance, AxiosResponse} from "axios"

export interface BaseConfig {
  baseUrl: string;
  apiKey: string;
  tmdbApiKey?: string;
  tpdbApiKey?: string;
}

export class BaseAPI<Config extends BaseConfig> {
  protected _adult = false
  protected _config: Config
  protected _axiosInstance: AxiosInstance
  protected _tmdbApi: TMDBApi | null = null
  protected _tpdbApi: TPDBApi | null = null
  protected _itemsType: 'movie' | 'tv' = 'movie'

  constructor(config: Config) {
    this._config = config
    this._axiosInstance = axios.create({
      baseURL: this._config.baseUrl,
    })
    // Add a request interceptor
    this._axiosInstance.interceptors.request.use((config) => {
      // Add default query parameters to the request
      config.params = config.params || {}
      config.params['apiKey'] = this._config.apiKey
      return config
    }, (error) => {
      // Handle the error
      return Promise.reject(error)
    })

    if (this._config.tmdbApiKey) {
      this._tmdbApi = new TMDBApi(this._config.tmdbApiKey)
    }
    if (this._config.tpdbApiKey) {
      this._tpdbApi = new TPDBApi(this._config.tpdbApiKey)
    }
  }

  async tmdbSearch(query: string, iterationCallback = (iteration: AxiosResponse<SearchResponse>) => Promise.resolve()) {
    if (!this._tmdbApi) {
      return {
        data: {},
        status: 402
      } as AxiosResponse
    }

    return await this._tmdbApi.search[this._itemsType](query, this._adult, iterationCallback)
  }

  async tpdbSearch(query: string, iterationCallback: (data: Data[]) => void | Promise<void>) {
    if (!this._tpdbApi) {
      return {
        data: {},
        status: 402
      } as AxiosResponse
    }

    return await this._tpdbApi.movie.get(undefined, {q: query, per_page: 50}, iterationCallback)
  }
}