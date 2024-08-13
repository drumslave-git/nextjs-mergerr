export enum AppType {
  whisparr = 'whisparr',
  radarr = 'radarr',
  sonarr = 'sonarr',
}

type ApiEndpoint = {
  uri: string
  params?: Record<string, any>
}

const RadarrApiEndpoints: Record<string, ApiEndpoint> = {
  root: {
    uri: '/api/v3',
  },
  status: {
    uri: '/api/v3/system/status',
  },
  queue: {
    uri: '/api/v3/queue',
    params: {
      pageSize: 100,
      includeUnknownMovieItems: true,
      includeMovie: true,
    },
  },
  manualImport: {
    uri: '/api/v3/manualimport',
    params: {
      filterExistingFiles: false,
    }
  },
  targets: {
    uri: '/api/v3/movie',
  },
  target: {
    uri: '/api/v3/movie',
    params: {
      includeMovie: true,
    },
  },
  targetPublicUri: {
    uri: '/movie',
  }
}

export const ApiEndpoints: {[key in AppType]: Record<string, ApiEndpoint>} = {
  radarr: RadarrApiEndpoints,
  sonarr: RadarrApiEndpoints, // TODO: Sonarr
  whisparr: RadarrApiEndpoints
}

export enum MergeStatus {
  created = 'created',
  running = 'running',
  done = 'done',
  failed = 'failed',
}