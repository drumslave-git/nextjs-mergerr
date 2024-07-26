import {MergeStatus} from "@/consts"
import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'
import path from 'path'
import {prisma} from '@/lib/prisma'

const debug = (...args: any[]) => {
  if (process.env.NODE_ENV !== 'development') return
  console.log(...args)
}

export async function POST(req: Request, {params}: { params: { id: string } }) {
  const data = await req.json()
  const output = path.join(data.output.path, data.output.name + '.' + data.output.extension)
  if (!fs.existsSync(data.output.path)) {
    fs.mkdirSync(data.output.path, {recursive: true})
  }
  let merge = await prisma.merge.findUnique({
    where: {
      output
    },
    include: {
      inputs: true
    }
  })
  if (!merge) {
    merge = await prisma.merge.create({
      data: {
        progress: 0,
        status: MergeStatus.created,
        inputs: {
          create: data.inputs.map(({path, name}: { path: string, name: string }) => ({
            path,
            name,
          }))
        },
        output,
        app: {
          connect: {
            id: params.id
          }
        }
      },
      include: {
        inputs: true
      }
    })
  }

  if (merge.status !== MergeStatus.created) {
    return Response.json(merge)
  }

  await prisma.merge.update({
    where: {
      id: merge.id
    },
    data: {
      status: MergeStatus.running,
    }
  })

  let ffmpegCommand = ffmpeg()
  for (const input of data.inputs) {
    ffmpegCommand = ffmpegCommand.input(input.path)
  }
  ffmpegCommand
    .on('end', async function () {
      debug('ffmpeg end')
      await prisma.merge.update({
        where: {
          id: merge.id
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
          id: merge.id
        },
        data: {
          status: MergeStatus.failed,
          error: err.message,
        }
      }).then(debug.bind(console))
    })
    .on('progress', async function (progress) {
      const inputsCount = merge.inputs.length
      debug('ffmpeg progress', progress.percent / inputsCount)
      await prisma.merge.update({
        where: {
          id: merge.id
        },
        data: {
          progress: progress.percent / inputsCount
        }
      })
    })
  // @ts-ignore
  ffmpegCommand.mergeToFile(output)
  return Response.json(merge)
}

export async function GET(req: Request, {params}: { params: { id: string } }) {
  const merge = await prisma.merge.findMany({
    where: {
      app_id: params.id
    },
    include: {
      inputs: true
    }
  })

  if (!merge) {
    return Response.json([])
  }

  return Response.json(merge)
}