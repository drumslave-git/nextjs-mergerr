import { AxiosInstance } from "axios"
import qs from "qs"

// Define types for manual import
export interface ManualImportOptions {
  folder?: string;
  downloadId?: string;
  movieId?: number;
  filterExistingFiles?: boolean;
}

export interface ManualImportItem {
  path: string;
  name: string;
  size: number;
  quality: {
    quality: {
      id: number;
      name: string;
    };
    revision: {
      version: number;
      real: number;
    };
  };
  languages: Array<{
    id: number;
    name: string;
  }>;
  movie: {
    id: number;
    title: string;
    year: number;
  };
  rejected: boolean;
  rejectionReasons: Array<{
    reason: string;
  }>;
}

export interface ImportDecision {
  title: string;
  approved: boolean;
  manualImport: boolean;
  movie: {
    id: number;
    title: string;
  };
}

export class ManualImportAPI {
  private axiosInstance: AxiosInstance

  constructor(private sharedAxiosInstance: AxiosInstance) {
    this.axiosInstance = sharedAxiosInstance
  }

  // Method to fetch manual import items
  public async fetchManualImportItems(options: ManualImportOptions): Promise<ManualImportItem[]> {
    try {
      const response = await this.axiosInstance.get<ManualImportItem[]>(`/manualimport?${qs.stringify(options)}`)
      return response.data
    } catch (error) {
      throw new Error(`Failed to fetch manual import items: ${error}`)
    }
  }

  // Method to import manual decisions
  public async importManualDecisions(decisions: ImportDecision[]): Promise<void> {
    try {
      await this.axiosInstance.post("/manualimport/import", decisions)
    } catch (error) {
      throw new Error(`Failed to import manual decisions: ${error}`)
    }
  }
}
