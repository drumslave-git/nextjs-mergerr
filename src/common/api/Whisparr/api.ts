import {RadarrAPI} from "@/common/api/Radarr/api"

export class WhisparrAPI extends RadarrAPI {
  protected _adult = true
}