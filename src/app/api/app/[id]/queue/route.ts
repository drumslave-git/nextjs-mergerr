import {ApiEndpoints} from "@/consts"
import formatOutputFilePath from "@/lib/formatOutputFilePath"
import {prisma} from "@/lib/prisma"
import withApi, {NextApiRequestWithApi} from "@/lib/withApi"
import qs from "qs"
import {AppType} from "@/consts"
import getTarget from "@/common/api/getTarget"

async function getHandler(req: NextApiRequestWithApi) {
  const resp = await req.api.queue.getAll()
  resp.data.records = await Promise.all(req.api.queue.filterMergable(resp.data.records).map(async record => {
    if (record.movieId) {
      const movieReq = await req.api.movie.get(record.movieId)
      record.movie = movieReq.data
    }
    return {
      ...record,
      mergerrOutputFile: formatOutputFilePath(record)
    }

  }))

  return Response.json(resp.data, {status: resp.status})
}

export const GET = withApi(getHandler)