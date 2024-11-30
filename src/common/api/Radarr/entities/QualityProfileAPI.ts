import {BaseEntityAPI} from "@/common/api/BaseEntityAPI"

// Define types for quality profile
export interface QualityProfile {
  id: number;
  name: string;
  upgradeAllowed: boolean;
  cutoff: {
    id: number;
    name: string;
  };
  items: Array<{
    quality: {
      id: number;
      name: string;
    };
    allowed: boolean;
  }>;
  minSize?: number;
  maxSize?: number;
}

export class QualityProfileAPI extends BaseEntityAPI {
  public async get(id?: number) {
    return await this._get<QualityProfile[] | QualityProfile, any>("qualityprofile" + (id ? `/${id}` : ""))
  }
}
