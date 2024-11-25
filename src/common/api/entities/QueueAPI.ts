import {BaseEntityAPI} from "@/common/api/entities/BaseEntityAPI"
import {AxiosResponse} from "axios"

// Define types for queue entries
export interface QueueEntry {
  id: number;
  movieId: number;
  title: string;
  size: number;
  sizeleft: number;
  timeleft: string;
  estimatedCompletionTime: string;
  status: string;
  trackedDownloadState: string;
  trackedDownloadStatus: string;
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
  statusMessages: {
    messages: string[];
  }[]
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
    const response = await this._get<Queue>('queue', {
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
  async get(queueId: number) {
    return await this._get<QueueEntry>(`queue/${queueId}`)
  }

  // Method to delete a specific queue item by ID
  async delete(queueId: number, blacklist: boolean = false) {
    return await this._delete(`queue/${queueId}`, { blacklist })
  }

  filterMergable(records: QueueEntry[]): QueueEntry[] {
    return records.filter(record => {
      return record.trackedDownloadState === 'importPending' &&
      record.trackedDownloadStatus === 'warning' &&
      record.statusMessages.filter((msg) => !!msg.messages.find((message) => message === 'Unable to parse file')).length > 1
    })
  }
}
