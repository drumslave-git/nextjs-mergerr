import { BaseEntityAPI } from "@/common/api/BaseEntityAPI"

export interface RootFolder {
  id: number
  oath: string
  accessible: boolean
  freeSpace: number
  unmappedFolders: {
    name: string
    path: string
    relativePath: string
  }
}

export class RootFolderAPI extends BaseEntityAPI {
  // Method to fetch all root folders
  public async get() {
    return await this._get<RootFolder[], any>("rootfolder")
  }
}
