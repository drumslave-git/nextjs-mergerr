import {ApiEndpoints} from "@/consts"
import formatOutputFilePath from "@/lib/formatOutputFilePath"
import {prisma} from "@/lib/prisma"
import withApi, {NextApiRequestWithApi} from "@/lib/withApi"
import qs from "qs"
import {AppType} from "@/consts"
import getTarget from "@/common/api/getTarget"

async function getHandler(req: NextApiRequestWithApi, { params }: { params: { id: string } }) {
  let resp
  try {
    resp = await req.api.queue.getAll()
    resp.records = await Promise.all(req.api.queue.filterMergable(resp.records).map(async record => {
      if (record.movieId) {
        record.movie = await req.api.movie.getById(record.movieId)
      }
      return {
        ...record,
        mergerrOutputFile: formatOutputFilePath(record)
      }

    }))
  } catch (e) {
    resp = {
      records: [],
      message: e.message,
    }
  }

  return Response.json(resp)
}

export const GET = withApi(getHandler)