import {MergeStatus, PostData} from "@/common/api/Mergerr/types"
import {RadarrAPI} from "@/common/api/Radarr/api"
import {QueueEntry} from "@/common/api/Radarr/entities/QueueAPI"
import {WhisparrAPI} from "@/common/api/Whisparr/api"
import {prisma} from "@/lib/prisma"
import ffmpeg from "fluent-ffmpeg"
import path from "path"

const debug = (...args: any[]) => {
  if (process.env.NODE_ENV !== 'development') return
  console.log(...args)
}

export class MergerrAPI {
  private _appId

  constructor(appId: string) {
    this._appId = appId
  }

  async create(data: PostData) {
    const existing = await prisma.merge.findUnique({
      where: {
        tmdbId: data.tmdbId,
        movieId: data.movieId.toString(),
        queueId: data.queueId
      }
    })
    if(existing) {
      if(existing.status === MergeStatus.running) {
        return null
      }
      await prisma.merge.delete({
        where: {
          id: existing.id
        }
      })
    }
    const createData = {
      data: {
        status: MergeStatus.created,
        progress: 0,
        movieId: data.movieId.toString(),
        tmdbId: data.tmdbId,
        queueId: data.queueId,
        inputs: {
          create: data.inputs.map(({path, name}: { path: string, name: string }) => ({
            path,
            name,
          }))
        },
        app: {
          connect: {
            id: this._appId
          }
        }
      },
      include: {
        inputs: true
      }
    }

    try {
      return await prisma.merge.create(createData)
    } catch (e) {
      const error = e as Error
      return {error: error.message}
    }
  }

  async update(id: string, data: Partial<PostData>) {
    const item = await prisma.merge.update({
      where: {
        id
      },
      // @ts-ignore
      data
    })

    return item
  }

  async get(id?: string) {
    if(!id) {
      return prisma.merge.findMany()
    }
    return prisma.merge.findUnique({
      where: {
        id
      },
      include: {
        inputs: true
      }
    })
  }

  async find({movieId, tmdbId, queueId}: {movieId?: string, tmdbId?: number, queueId?: number}) {
    return prisma.merge.findUnique({
      where: {
        movieId,
        tmdbId,
        queueId
      },
      include: {
        inputs: true
      }
    })
  }

  async delete(id: string) {
    return prisma.merge.delete({where: {id}})
  }

  async run(id: string) {
    const merge = await this.get(id)
    if(!merge) {
      return null
    }
    let ffmpegCommand = ffmpeg()
    for (const input of merge.inputs) {
      ffmpegCommand = ffmpegCommand.input(input.path)
    }

    await prisma.merge.update({
      where: {
        id
      },
      data: {
        status: MergeStatus.running,
      }
    })

    const app = await prisma.app.findUnique({
      where: {
        id: this._appId
      }
    })
    if(!app) {
      return null
    }
    let arrAPIClass = RadarrAPI
    if(app.type === 'whisparr') {
      arrAPIClass = WhisparrAPI
    }
    const arrAPI = new arrAPIClass({
      apiKey: app.api_key,
      baseUrl: app.url
    })

    const queueResp = await arrAPI.queue.details(merge.movieId, {includeMovie: true})
    let queue = queueResp.data
    if(Array.isArray(queue) && queue.length) {
      queue = queue.find(q => q.id === merge.queueId) as QueueEntry
    } else {
      return null
    }
    const output = queue.movie.path + path.sep + queue.movie.cleanTitle + '.mkv'
    const tmp = path.resolve(output, `${merge.queueId}-${merge.movieId}-${merge.tmdbId}`)

    ffmpegCommand
      .on('end', async function () {
        debug('ffmpeg end')
        await prisma.merge.update({
          where: {
            id
          },
          data: {
            status: MergeStatus.done,
            result: 'merged successfully',
            progress: 100
          }
        })
      })
      .on('error', async function (err) {
        await prisma.merge.update({
          where: {
            id
          },
          data: {
            status: MergeStatus.failed,
            result: 'merged failed',
            error: err.message,
          }
        }).then(debug.bind(console))
      })
      .on('progress', async function (progress) {
        const inputsCount = merge.inputs.length
        debug('ffmpeg progress', (progress.percent || 0) / inputsCount)
        await prisma.merge.update({
          where: {
            id
          },
          data: {
            progress: (progress.percent || 0) / inputsCount
          }
        })
      })

    ffmpegCommand.mergeToFile(output, tmp)
  }
}