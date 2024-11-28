import {BaseEntityAPI} from "@/common/api/BaseEntityAPI"

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

export class ManualImportAPI extends BaseEntityAPI {
  // Method to fetch manual import items
  async fetchManualImportItems(options: ManualImportOptions) {
    return await this._get<ManualImportItem[]>('manualimport', options)
  }

  // Method to import manual decisions
  async importManualDecisions(decisions: ImportDecision[]) {
    await this._post<void>("manualimport/import", decisions)
  }
}
