import { AxiosInstance } from "axios"
import qs from "qs"

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

export class QueueAPI {
  private axiosInstance: AxiosInstance

  constructor(private sharedAxiosInstance: AxiosInstance) {
    this.axiosInstance = sharedAxiosInstance
  }

  // Method to fetch all queue entries
  public async getAll(page = 1, records: QueueEntry[] = []): Promise<Queue> {
    try {
      const response = await this.axiosInstance.get<Queue>(`/queue?${qs.stringify({
        page,
        pageSize: 100,
        includeUnknownMovieItems: true,
        includeMovie: true,
      })}`)
      records = [...records, ...response.data.records]
      if (records.length < response.data.totalRecords) {
        return await this.getAll(page + 1, records)
      }
      return {
        ...response.data,
        records
      }
    } catch (error) {
      throw new Error(`Failed to fetch queue entries: ${error}`)
    }
  }

  // Method to delete a specific queue item by ID
  public async delete(queueId: number, blacklist: boolean = false): Promise<void> {
    try {
      const params = { blacklist }
      await this.axiosInstance.delete(`/queue/${queueId}`, { params })
    } catch (error) {
      throw new Error(`Failed to delete queue item with ID ${queueId}: ${error}`)
    }
  }

  public filterMergable(records: QueueEntry[]): QueueEntry[] {
    return records.filter(record => {
      return record.trackedDownloadState === 'importPending' &&
      record.trackedDownloadStatus === 'warning' &&
      record.statusMessages.filter((msg) => !!msg.messages.find((message) => message === 'Unable to parse file')).length > 1
    })
  }
}
