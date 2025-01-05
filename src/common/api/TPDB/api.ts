import {MovieAPI} from "@/common/api/TPDB/entities/MovieAPI"
import {UserAPI} from "@/common/api/TPDB/entities/UserAPI"
import axios, {AxiosInstance} from "axios"

export class TPDBApi {
  private _apiKey: string
  private _axiosInstance: AxiosInstance

  user: UserAPI
  movie: MovieAPI

  constructor(apiKey: string = '') {
    this._apiKey = apiKey
    this._axiosInstance = axios.create({
      baseURL: 'https://api.theporndb.net',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${this._apiKey}`
      }
    })

    this.user = new UserAPI(this._axiosInstance)
    this.movie = new MovieAPI(this._axiosInstance)
  }
}