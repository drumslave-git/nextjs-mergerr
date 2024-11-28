import {BaseEntityAPI} from "@/common/api/BaseEntityAPI"
import {AxiosError} from "axios"

export interface ImagesConfig {
  base_url: string;
  secure_base_url: string;
  backdrop_sizes: string[];
  logo_sizes: string[];
  poster_sizes: string[];
  profile_sizes: string[];
  still_sizes: string[];
}

export interface ConfigurationResponse {
  images: ImagesConfig;
  change_keys: string[];
}

export class ConfigurationAPI extends BaseEntityAPI {
  async details() {
    return this._get<ConfigurationResponse, any>("configuration")
  }
}