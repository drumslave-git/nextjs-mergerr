// Import all entity APIs (e.g., MovieAPI, SystemAPI, etc.)
import {BaseAPI, BaseConfig} from "@/common/api/BaseAPI"
import {ManualImportAPI} from "@/common/api/Radarr/entities/ManualImportAPI"
import {MovieLookupAPI} from "@/common/api/Radarr/entities/MovieLookupAPI"
import {QualityProfileAPI} from "@/common/api/Radarr/entities/QualityProfileAPI"
import {QueueAPI} from "@/common/api/Radarr/entities/QueueAPI"
import {RootFolderAPI} from "@/common/api/Radarr/entities/RootFolderAPI"
import {SystemAPI} from "@/common/api/Radarr/entities/SystemAPI"
import {MovieAPI, MovieAddSetting} from "@/common/api/Radarr/entities/MovieAPI"

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
  public rootFolder: RootFolderAPI
  public qualityProfile: QualityProfileAPI

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
    this.rootFolder = new RootFolderAPI(this._axiosInstance)
    this.qualityProfile = new QualityProfileAPI(this._axiosInstance)
  }

  async addByTMDB(tmdbId: number, options: MovieAddSetting) {
    const resp = await this.movieLookup.tmdb(tmdbId)
    if (!resp.data) {
      throw new Error(`No movie found for TMDB ID: ${tmdbId}`)
    }

    const data = {
      ...resp.data,
      ...options
    }

    const result = await this.movie.add(data)
    if (result.status === 201) {
      return result
    }
    
    return {
      ...result,
      data: {
        ...result.data,
        postedDataWas: data
      }
    }
  }
}
