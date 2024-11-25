// Import all entity APIs (e.g., MovieAPI, SystemAPI, etc.)
import {ManualImportAPI} from "@/common/api/entities/ManualImportAPI"
import {QueueAPI} from "@/common/api/entities/QueueAPI"
import {SystemAPI} from "@/common/api/entities/SystemAPI"
import axios, { AxiosInstance } from "axios"
import { MovieAPI } from "@/common/api/entities/MovieAPI"

// Define the configuration type for the API
export interface RadarrAPIConfig {
  baseUrl: string;
  apiKey: string;
}

// Master class to manage API access
export class RadarrAPI {
  private config: RadarrAPIConfig
  private axiosInstance: AxiosInstance

  // Entity APIs
  public system: SystemAPI
  public movie: MovieAPI
  public queue: QueueAPI
  public manualImport: ManualImportAPI

  constructor(config: RadarrAPIConfig) {
    this.config = config
    this.axiosInstance = axios.create({
      baseURL: `${config.baseUrl}/api/v3`,
    })
    // Add a request interceptor
    this.axiosInstance.interceptors.request.use((config) => {
      // Add default query parameters to the request
      config.params = config.params || {}
      config.params['apiKey'] = this.config.apiKey
      return config
    }, (error) => {
      // Handle the error
      return Promise.reject(error)
    })

    // Initialize each entity with the shared config
    this.system = new SystemAPI(this.axiosInstance)
    this.movie = new MovieAPI(this.axiosInstance)
    this.queue = new QueueAPI(this.axiosInstance)
    this.manualImport = new ManualImportAPI(this.axiosInstance)
  }
}
