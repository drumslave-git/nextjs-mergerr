import { type Input, type Merge } from '@prisma/client'

export enum MergeStatus {
  created = 'created',
  running = 'running',
  done = 'done',
  failed = 'failed',
}

export interface PostData {
  inputs: {
    path: string
    name: string
  }[]
  movieId: string | number
  tmdbId: number
  queueId: number
}

export interface MergeWithInputs extends Merge {
  inputs: Input[]
}