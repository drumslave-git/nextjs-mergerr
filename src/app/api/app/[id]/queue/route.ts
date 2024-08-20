import {ApiEndpoints} from "@/consts"
import formatOutputFilePath from "@/lib/formatOutputFilePath"
import {prisma} from "@/lib/prisma"
import qs from "qs"
import {AppType} from "@/consts"
import getTarget from "@/common/api/getTarget"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const app = await prisma.app.findUnique({
    where: {
      id: params.id,
    },
  })

  if (!app) {
    return Response.json({message: 'App not found'}, {status: 404})
  }

  const apiEndPoint = ApiEndpoints[app.type as AppType].queue
  const apiEndPointParams = qs.stringify({
    ...apiEndPoint.params,
    apiKey: app.api_key,
  })

  const queueReq = await fetch(`${app.url}${apiEndPoint.uri}?${apiEndPointParams}`, { cache: "no-cache" } )
  const resp = await queueReq.json()
  resp.records = resp.records.filter(apiEndPoint.filterMergable || (() => true))
  resp.records = await Promise.all(resp.records.map(async (record: any) => {
    if (record.movieId) {
      const targetReq = await getTarget(app, record.movieId)
      record.movie = await targetReq.json()
    }
    return {
      ...record,
      mergerrOutputFile: formatOutputFilePath(record)
    }
  }))

  return Response.json(resp, {status: queueReq.status})
}