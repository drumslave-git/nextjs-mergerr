import {BaseEntityAPI} from "@/common/api/BaseEntityAPI"
import {Movie} from "@/common/api/Radarr/entities/MovieAPI"
import {AxiosResponse} from "axios"

// Define types for queue entries
export interface QueueEntry {
  id: number;
  movieId?: number;
  tmdbId: number;
  title: string;
  size: number;
  sizeleft: number;
  timeleft: string;
  estimatedCompletionTime: string;
  status: string;
  trackedDownloadState?: string;
  trackedDownloadStatus?: string;
  downloadId: string;
  protocol: string;
  indexer: string;
  outputPath: string;
  errorMessage?: string;
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
  statusMessages?: {
    messages: string[];
    title: string;
  }[],
  movie?: Movie
}

export interface Queue {
  page: number;
  pageSize: number;
  sortKey: string;
  sortDirection: string;
  totalRecords: number;
  records: QueueEntry[];
}

export class QueueAPI extends BaseEntityAPI {
  // Method to fetch all queue entries
  async getAll(page = 1, records: QueueEntry[] = []): Promise<AxiosResponse<Queue, any>> {
    const response = await this._get<Queue, any>('queue', {
      page,
      pageSize: 100,
      includeUnknownMovieItems: true,
      includeMovie: true,
    })

    records = [...records, ...response.data.records]
    
    if (records.length < response.data.totalRecords) {
      return await this.getAll(page + 1, records)
    }

    return {
      ...response,
      data: {
        ...response.data,
        records
      }
    }
  }

  // Method to get a specific queue item by ID
  async details(movieId: string | number, {includeMovie = false}: {includeMovie?: boolean} = {}) {
    return await this._get<QueueEntry[], any>('queue/details', {movieId, includeMovie})
  }

  // Method to delete a specific queue item by ID
  async delete(queueId: number, blacklist: boolean = false) {
    return await this._delete(`queue/${queueId}`, { blacklist })
  }

  isPending(record: QueueEntry): boolean {
    return record.trackedDownloadState === 'importPending'
  }

  isCompleted(record: QueueEntry): boolean {
    return record.status === 'completed'
  }

  hasStatusMessages(record: QueueEntry): boolean {
    return !!record.statusMessages
  }

  isMergable(record: QueueEntry): boolean {
    return !!(record.trackedDownloadStatus === 'warning' && record.statusMessages &&
      record.statusMessages.filter((msg) => !!msg.messages.find((message) => message === 'Unable to parse file')).length > 1)
  }
}
