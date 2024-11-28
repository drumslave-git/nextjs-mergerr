// Import all entity APIs (e.g., MovieAPI, SystemAPI, etc.)
import {BaseAPI, BaseConfig} from "@/common/api/BaseAPI"
import {ManualImportAPI} from "@/common/api/Radarr/entities/ManualImportAPI"
import {MovieLookupAPI} from "@/common/api/Radarr/entities/MovieLookupAPI"
import {QueueAPI} from "@/common/api/Radarr/entities/QueueAPI"
import {SystemAPI} from "@/common/api/Radarr/entities/SystemAPI"
import { MovieAPI } from "@/common/api/Radarr/entities/MovieAPI"

// Define the configuration type for the API
export interface RadarrAPIConfig extends BaseConfig {}

// Master class to manage API access
export class RadarrAPI extends BaseAPI<RadarrAPIConfig>{
  // Entity APIs
  public system: SystemAPI
  public movie: MovieAPI
  public queue: QueueAPI
  public manualImport: ManualImportAPI
  public movieLookup: MovieLookupAPI

  constructor(config: RadarrAPIConfig) {
    super({
      ...config,
      baseUrl: `${config.baseUrl}/api/v3`,
    })

    this._adult = false

    // Initialize each entity with the shared config
    this.system = new SystemAPI(this._axiosInstance)
    this.movie = new MovieAPI(this._axiosInstance)
    this.queue = new QueueAPI(this._axiosInstance)
    this.manualImport = new ManualImportAPI(this._axiosInstance)
    this.movieLookup = new MovieLookupAPI(this._axiosInstance)
  }
}
