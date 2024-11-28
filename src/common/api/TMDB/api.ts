import {AuthAPI} from "@/common/api/TMDB/entities/AuthAPI"
import {ConfigurationAPI} from "@/common/api/TMDB/entities/ConfigurationAPI"
import {GenresAPI} from "@/common/api/TMDB/entities/GenresAPI"
import {MovieAPI} from "@/common/api/TMDB/entities/MovieAPI"
import {SearchAPI} from "@/common/api/TMDB/entities/SearchAPI"
import axios, {AxiosInstance} from "axios"

export class TMDBApi {
  private _apiKey: string
  private _axiosInstance: AxiosInstance

  auth: AuthAPI
  search: SearchAPI
  genres: GenresAPI
  configuration: ConfigurationAPI
  movie: MovieAPI

  constructor(apiKey: string) {
    this._apiKey = apiKey
    this._axiosInstance = axios.create({
      baseURL: 'https://api.themoviedb.org/3',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${this._apiKey}`
      }
    })

    this.auth = new AuthAPI(this._axiosInstance)
    this.search = new SearchAPI(this._axiosInstance)
    this.genres = new GenresAPI(this._axiosInstance)
    this.configuration = new ConfigurationAPI(this._axiosInstance)
    this.movie = new MovieAPI(this._axiosInstance)
  }
}